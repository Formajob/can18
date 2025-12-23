import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, activityId } = body

    if (!name || !activityId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    const activity = await db.activity.findFirst({
      where: { name: activityId.toUpperCase() },
    })

    if (!activity) {
      return NextResponse.json(
        { error: 'Activité non trouvée' },
        { status: 400 }
      )
    }

    let user = await db.user.findFirst({
      where: { name },
      include: { activity: true },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
          activityId: activity.id,
          isAdmin: name === 'admin',
        },
        include: { activity: true },
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        activityId: user.activityId,
        isAdmin: user.isAdmin,
        totalPoints: user.totalPoints,
      },
    })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
