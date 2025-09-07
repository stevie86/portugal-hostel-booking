'use client'

import React, { useState, useEffect } from 'react'

interface Room {
  id: string
  name: string
  bedsTotal: number
  hasBathroom: boolean
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const propertyId = urlParams.get('propertyId')
      const url = propertyId ? `/api/rooms?propertyId=${propertyId}` : '/api/rooms'

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      } else {
        setError('Failed to load rooms')
      }
    } catch (err) {
      setError('Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityPercentage = (roomId: string) => {
    // Mock availability: random between 40-60%
    return Math.floor(Math.random() * 21) + 40
  }

  const getFreeBeds = (room: Room) => {
    const bookedPercentage = getAvailabilityPercentage(room.id)
    const freeBeds = Math.round(room.bedsTotal * (100 - bookedPercentage) / 100)
    return Math.max(0, freeBeds)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading rooms...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Rooms</h1>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rooms available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => {
              const freeBeds = getFreeBeds(room)
              const availabilityPercentage = getAvailabilityPercentage(room.id)

              return (
                <div key={room.id} className="bg-white rounded-lg border p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-2">{room.name}</h2>

                  <div className="mb-4">
                    <p className="text-gray-600">
                      {room.bedsTotal} beds total • {room.hasBathroom ? 'Private bathroom' : 'Shared bathroom'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Availability (next 7 days)</span>
                      <span className="text-sm font-medium">{freeBeds} free</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${availabilityPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Book Now
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/admin" className="text-blue-600 underline">Go to Admin</a>
        </div>
      </div>
    </div>
  )
}