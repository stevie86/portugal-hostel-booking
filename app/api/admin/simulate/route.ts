import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-token')
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { startDate, endDate, occupancyPercentage } = await request.json()

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Get all rooms
    const rooms = await prisma.room.findMany()

    // Delete existing bookings
    await prisma.booking.deleteMany()

    // Generate random bookings
    const bookings: { roomId: string; checkIn: Date; checkOut: Date }[] = []

    for (const room of rooms) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      for (let i = 0; i < days; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)

        // Randomly decide if this bed is booked based on occupancy percentage
        const isBooked = Math.random() < (occupancyPercentage / 100)

        if (isBooked) {
          const checkIn = new Date(date)
          const checkOut = new Date(date)
          checkOut.setDate(checkOut.getDate() + 1) // 1-night stay

          bookings.push({
            roomId: room.id,
            checkIn,
            checkOut,
          })
        }
      }
    }

    // Create bookings in database
    for (const booking of bookings) {
      await prisma.booking.create({
        data: booking,
      })
    }

    return NextResponse.json({
      success: true,
      bookingsCreated: bookings.length
    })
  } catch (error) {
    console.error('Simulation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}