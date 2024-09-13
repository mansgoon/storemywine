import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(request, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const updatedWine = await prisma.wine.updateMany({
      where: { id: parseInt(params.id), userId },
      data: { rating: body.rating },
    })
    return NextResponse.json(updatedWine)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating wine rating', details: error.message }, { status: 500 })
  }
}