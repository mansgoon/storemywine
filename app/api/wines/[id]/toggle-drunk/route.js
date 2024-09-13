import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(request, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const wine = await prisma.wine.findFirst({
      where: { id: parseInt(params.id), userId },
    })
    if (!wine) return NextResponse.json({ error: 'Wine not found' }, { status: 404 })

    const newIsDrunk = !wine.isDrunk
    const updatedWine = await prisma.wine.update({
      where: { id: parseInt(params.id) },
      data: { 
        isDrunk: newIsDrunk,
        rating: newIsDrunk ? wine.rating : 0 // Reset rating to 0 if marked as undrunk
      },
    })
    return NextResponse.json(updatedWine)
  } catch (error) {
    return NextResponse.json({ error: 'Error toggling wine drunk status', details: error.message }, { status: 500 })
  }
}