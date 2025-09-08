'use client'

import React, { useState, useEffect } from 'react'
import DatabaseStatus from '../../components/DatabaseStatus'

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏨 Hostel Room Management</h1>
          <p className="text-gray-600">Manage your property's room inventory and availability</p>
        </div>

        {/* Database Status */}
        <div className="mb-6">
          <DatabaseStatus />
        </div>

        {isDemoMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
                <p className="text-sm text-yellow-700">Changes are not persisted in preview deployments</p>
              </div>
            </div>
          </div>
        )}

        {property && (
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{property.name}</h2>
                <p className="text-sm text-gray-600">Property Management Dashboard</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Room Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Room</h3>
          </div>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 6-Bed Mixed Dorm"
                  required
                  minLength={2}
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Beds</label>
                <input
                  type="number"
                  value={bedsTotal}
                  onChange={(e) => setBedsTotal(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="24"
                  required
                />
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <input
                type="checkbox"
                id="bathroom"
                checked={hasBathroom}
                onChange={(e) => setHasBathroom(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="bathroom" className="ml-2 text-sm text-gray-700">
                <span className="font-medium">Private bathroom</span>
                <span className="text-gray-500 ml-1">(additional charge may apply)</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              ➕ Create Room
            </button>
          </form>
        </div>

        {/* Rooms List */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Current Rooms ({rooms.length})</h3>
            </div>
            <div className="text-sm text-gray-500">
              {rooms.length === 0 ? 'No rooms yet' : `${rooms.length} room${rooms.length === 1 ? '' : 's'} managed`}
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No rooms created yet</p>
              <p className="text-gray-400 text-sm">Add your first room using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{room.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{room.bedsTotal} beds</span>
                        <span>•</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          room.hasBathroom
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {room.hasBathroom ? '🛁 Private' : '🚿 Shared'} bathroom
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    🗑️ Delete
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