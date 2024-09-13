import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Fetching wines for user:', userId)
    const wines = await prisma.wine.findMany({
      where: { userId },
    })
    console.log('Fetched wines:', wines)
    return NextResponse.json(wines)
  } catch (error) {
    console.error('Error fetching wines:', error)
    return NextResponse.json({ error: 'Error fetching wines', details: error.message }, { status: 500 })
  }
}

// Add other CRUD operations here (POST, PUT, DELETE) as needed