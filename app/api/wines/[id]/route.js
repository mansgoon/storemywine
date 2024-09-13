import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const wine = await prisma.wine.findFirst({
      where: { id: parseInt(params.id), userId },
    })
    if (!wine) return NextResponse.json({ error: 'Wine not found' }, { status: 404 })
    return NextResponse.json(wine)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching wine', details: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const wine = await prisma.wine.updateMany({
      where: { id: parseInt(params.id), userId },
      data: body,
    })
    return NextResponse.json(wine)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating wine', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.wine.deleteMany({
      where: { id: parseInt(params.id), userId },
    })
    return NextResponse.json({ message: 'Wine deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting wine', details: error.message }, { status: 500 })
  }
}