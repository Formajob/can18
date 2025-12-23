import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      )
    }

    const predictions = await db.prediction.findMany({
      where: { userId },
      include: { match: true },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pronostics' },
      { status: 500 }
    )
  }
}
