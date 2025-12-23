import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const activities = [
      { name: 'Activité 1', description: 'Première activité' },
      { name: 'Activité 2', description: 'Deuxième activité' },
      { name: 'Activité 3', description: 'Troisième activité' },
      { name: 'Activité 4', description: 'Quatrième activité' },
    ]

    for (const activity of activities) {
      await db.activity.upsert({
        where: { name: activity.name },
        update: {},
        create: activity,
      })
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      activities: await db.activity.findMany(),
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation de la base de données' },
      { status: 500 }
    )
  }
}
