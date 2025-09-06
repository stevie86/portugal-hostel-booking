import React from 'react'
import { prisma } from '../lib/prisma'

export default async function Home() {
  const property = await prisma.property.findFirst()
  const rooms = property ? await prisma.room.findMany({
    where: { propertyId: property.id },
    include: { bookings: true }
  }) : []

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const getAvailability = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return 0

    const bookedToday = room.bookings.filter(b =>
      b.checkIn <= today && b.checkOut > today
    ).length

    return room.bedsTotal - bookedToday
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Hostel Availability</h1>

        {property ? (
          <div>
            <h2 className="text-xl mb-4">{property.name}</h2>

            {rooms.length > 0 ? (
              <div className="space-y-4">
                {rooms.map(room => (
                  <div key={room.id} className="border p-4 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-600">
                          {getAvailability(room.id)} / {room.bedsTotal} beds available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Today: {today.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No rooms configured.</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 mb-4">No property configured yet.</p>
            <a href="/admin" className="text-blue-600 underline">Go to Admin</a>
          </div>
        )}
      </div>
    </div>
  )
}