import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const matches = await db.match.findMany({
      orderBy: { matchDateTime: 'asc' },
    })

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des matchs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamA, teamB, matchDateTime } = body

    if (!teamA || !teamB || !matchDateTime) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const match = await db.match.create({
      data: {
        teamA,
        teamB,
        matchDateTime: new Date(matchDateTime),
      },
    })

    return NextResponse.json({ match })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du match' },
      { status: 500 }
    )
  }
}
