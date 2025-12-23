import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const activities = [
      { name: 'VD', description: 'VD' },
      { name: 'PGV', description: 'PGV' },
      { name: 'AMC', description: 'AMC' },
      { name: 'EDITA', description: 'EDITA' },
    ]

    for (const activity of activities) {
      await db.activity.upsert({
        where: { name: activity.name },
        update: {},
        create: activity,
      })
    }

    return NextResponse.json({
      message: 'Activités initialisées avec succès',
      activities,
    })
  } catch (error) {
    console.error('Error initializing activities:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation des activités' },
      { status: 500 }
    )
  }
}
