import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function calculatePoints(
  predictedScoreA: number,
  predictedScoreB: number,
  actualScoreA: number,
  actualScoreB: number
): number {
  const predictedWinner =
    predictedScoreA > predictedScoreB
      ? 'A'
      : predictedScoreB > predictedScoreA
      ? 'B'
      : 'DRAW'
  const actualWinner =
    actualScoreA > actualScoreB ? 'A' : actualScoreB > actualScoreA ? 'B' : 'DRAW'

  const exactScore =
    predictedScoreA === actualScoreA && predictedScoreB === actualScoreB
  const correctWinner = predictedWinner === actualWinner

  if (exactScore) {
    return 3
  }
  if (correctWinner) {
    return 1
  }
  return 0
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { scoreA, scoreB } = body

    if (scoreA === undefined || scoreB === undefined) {
      return NextResponse.json(
        { error: 'Les scores sont requis' },
        { status: 400 }
      )
    }

    const match = await db.match.update({
      where: { id },
      data: {
        actualScoreA: scoreA,
        actualScoreB: scoreB,
        status: 'COMPLETED',
      },
      include: {
        predictions: {
          include: {
            user: true,
          },
        },
      },
    })

    const updates = match.predictions.map((prediction) => {
      const pointsEarned = calculatePoints(
        prediction.predictedScoreA,
        prediction.predictedScoreB,
        scoreA,
        scoreB
      )

      return db.prediction.update({
        where: { id: prediction.id },
        data: { pointsEarned },
      })
    })

    await Promise.all(updates)

    const userPointsUpdates = match.predictions.map((prediction) => {
      return db.user.update({
        where: { id: prediction.userId },
        data: {
          totalPoints: {
            increment: prediction.pointsEarned,
          },
        },
      })
    })

    await Promise.all(userPointsUpdates)

    return NextResponse.json({
      match,
      predictionsUpdated: match.predictions.length,
    })
  } catch (error) {
    console.error('Error updating match result:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du résultat' },
      { status: 500 }
    )
  }
}
