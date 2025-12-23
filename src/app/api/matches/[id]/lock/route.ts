import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const match = await db.match.update({
      where: { id },
      data: { status: 'LOCKED' },
    })

    return NextResponse.json({ match })
  } catch (error) {
    console.error('Error locking match:', error)
    return NextResponse.json(
      { error: 'Erreur lors du verrouillage du match' },
      { status: 500 }
    )
  }
}
