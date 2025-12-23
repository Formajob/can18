import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, matchId, predictedScoreA, predictedScoreB } = body

    if (!userId || !matchId || predictedScoreA === undefined || predictedScoreB === undefined) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const match = await db.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match non trouvé' },
        { status: 404 }
      )
    }

    if (match.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Les pronostics sont fermés pour ce match' },
        { status: 400 }
      )
    }

    const existingPrediction = await db.prediction.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
    })

    if (existingPrediction) {
      return NextResponse.json(
        { error: 'Vous avez déjà fait un pronostic pour ce match' },
        { status: 400 }
      )
    }

    const prediction = await db.prediction.create({
      data: {
        userId,
        matchId,
        predictedScoreA,
        predictedScoreB,
      },
      include: { match: true },
    })

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du pronostic' },
      { status: 500 }
    )
  }
}
