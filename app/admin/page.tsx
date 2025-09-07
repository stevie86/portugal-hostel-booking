'use client'

import React, { useState, useEffect } from 'react'

interface Room {
  id: string
  name: string
  bedsTotal: number
  hasBathroom: boolean
}

interface Property {
  id: string
  name: string
}

export default function Admin() {
  const [property, setProperty] = useState<Property | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState('')
  const [bedsTotal, setBedsTotal] = useState(1)
  const [hasBathroom, setHasBathroom] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load property (assuming there's only one for MVP)
      const propResponse = await fetch('/api/properties')
      if (propResponse.ok) {
        const properties = await propResponse.json()
        if (properties.length > 0) {
          setProperty(properties[0])
        }
      }

      // Load rooms
      const roomsResponse = await fetch('/api/rooms')
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json()
        setRooms(roomsData.data || roomsData)
        if (roomsData.demo) {
          setIsDemoMode(true)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          name: roomName,
          bedsTotal,
          hasBathroom,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.demo) {
          setIsDemoMode(true)
          setMessage('Room created successfully! (Demo mode - not persisted)')
        } else {
          setMessage('Room created successfully!')
        }
        setRoomName('')
        setBedsTotal(1)
        setHasBathroom(false)
        loadData() // Reload rooms
      } else {
        setMessage('Error creating room')
      }
    } catch (error) {
      setMessage('Error creating room')
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.demo) {
          setIsDemoMode(true)
          setMessage('Room deleted successfully! (Demo mode - not persisted)')
        } else {
          setMessage('Room deleted successfully!')
        }
        loadData() // Reload rooms
      } else {
        setMessage('Error deleting room')
      }
    } catch (error) {
      setMessage('Error deleting room')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Room Management</h1>

        {isDemoMode && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Demo mode: changes are not persisted in preview
          </div>
        )}

        {property && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Property: {property.name}</h2>
          </div>
        )}

        {/* Create Room Form */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g. 6-Bed Mixed Dorm"
                required
                minLength={2}
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Beds</label>
              <input
                type="number"
                value={bedsTotal}
                onChange={(e) => setBedsTotal(parseInt(e.target.value) || 1)}
                className="w-full p-2 border rounded"
                min="1"
                max="24"
                required
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasBathroom}
                  onChange={(e) => setHasBathroom(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Private bathroom</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Room
            </button>
          </form>
        </div>

        {/* Rooms List */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Current Rooms</h3>
          {rooms.length === 0 ? (
            <p className="text-gray-500">No rooms created yet.</p>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-gray-600">
                      {room.bedsTotal} beds • {room.hasBathroom ? 'Private bathroom' : 'Shared bathroom'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-center">
            {message}
          </div>
        )}

        <div className="mt-6">
          <a href="/rooms" className="text-blue-600 underline">View Public Rooms Page</a>
        </div>
      </div>
    </div>
  )
}