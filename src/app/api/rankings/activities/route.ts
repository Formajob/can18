import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const activities = await db.activity.findMany({
      include: {
        users: {
          orderBy: {
            totalPoints: 'desc',
          },
        },
      },
    })

    const rankings = activities.map((activity) => ({
      activityName: activity.name,
      entries: activity.users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        userName: user.name,
        userActivity: activity.name,
        totalPoints: user.totalPoints,
      })),
    }))

    return NextResponse.json({ rankings })
  } catch (error) {
    console.error('Error fetching activity rankings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement par activité' },
      { status: 500 }
    )
  }
}
