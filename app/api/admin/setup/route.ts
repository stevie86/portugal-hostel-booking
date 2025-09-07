import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-token')
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { propertyName, rooms } = await request.json()

    // For minimal MVP, just create a simple property and rooms
    // Delete existing data first
    await prisma.booking.deleteMany()
    await prisma.room.deleteMany()
    await prisma.property.deleteMany()

    // Create property
    const property = await prisma.property.create({
      data: {
        name: propertyName || 'Demo Hostel',
        city: 'Lisbon'
      },
    })

    // Create rooms if provided
    if (rooms && Array.isArray(rooms)) {
      for (const room of rooms) {
        await prisma.room.create({
          data: {
            name: room.name,
            bedsTotal: room.bedsTotal || 4,
            hasBathroom: room.hasBathroom || false,
            propertyId: property.id
          },
        })
      }
    }

    return NextResponse.json({ success: true, propertyId: property.id })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}