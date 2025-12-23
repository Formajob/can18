import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      include: { activity: true },
      orderBy: {
        totalPoints: 'desc',
      },
    })

    const rankings = users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      userName: user.name,
      userActivity: user.activity.name,
      totalPoints: user.totalPoints,
    }))

    return NextResponse.json({ rankings })
  } catch (error) {
    console.error('Error fetching individual rankings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement individuel' },
      { status: 500 }
    )
  }
}
