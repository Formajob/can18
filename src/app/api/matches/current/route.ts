import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const now = new Date()
    const match = await db.match.findFirst({
      where: {
        OR: [
          {
            matchDateTime: { gte: now },
            status: { in: ['SCHEDULED', 'LOCKED'] },
          },
          {
            matchDateTime: { lt: now },
            status: 'LOCKED',
          },
        ],
      },
      orderBy: { matchDateTime: 'asc' },
    })

    let prediction = null
    if (match && userId) {
      prediction = await db.prediction.findUnique({
        where: {
          userId_matchId: {
            userId,
            matchId: match.id,
          },
        },
        include: { match: true },
      })
    }

    return NextResponse.json({ match, prediction })
  } catch (error) {
    console.error('Error fetching current match:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du match actuel' },
      { status: 500 }
    )
  }
}
