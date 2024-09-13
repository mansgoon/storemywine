import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received wine data:', body)
    
    // Ensure all required fields are present
    const requiredFields = ['name', 'type', 'region', 'description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: 'Validation error', details: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const wine = await prisma.wine.create({
      data: {
        name: body.name,
        type: body.type,
        region: body.region,
        description: body.description,
        userId,
      },
    })
    console.log('Created wine:', wine)
    return NextResponse.json(wine, { status: 201 })
  } catch (error) {
    console.error('Error creating wine:', error)
    return NextResponse.json({ error: 'Error creating wine', details: error.message }, { status: 500 })
  }
}