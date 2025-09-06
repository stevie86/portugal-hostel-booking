'use client'

import React, { useState } from 'react'

export default function Admin() {
  const [propertyName, setPropertyName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [bedsTotal, setBedsTotal] = useState(1)
  const [adminToken, setAdminToken] = useState('dev-admin')
  const [message, setMessage] = useState('')

  const handleSetup = async () => {
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          propertyName,
          rooms: [{ name: roomName, bedsTotal }],
        }),
      })

      if (response.ok) {
        setMessage('Property and room saved!')
      } else {
        setMessage('Error saving data')
      }
    } catch (error) {
      setMessage('Error saving data')
    }
  }

  const handleSimulate = async () => {
    try {
      const response = await fetch('/api/admin/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          occupancyPercentage: 50,
        }),
      })

      if (response.ok) {
        setMessage('Bookings simulated!')
      } else {
        setMessage('Error simulating bookings')
      }
    } catch (error) {
      setMessage('Error simulating bookings')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Admin token"
          />
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Property name"
          />
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Room name"
          />
          <input
            type="number"
            value={bedsTotal}
            onChange={(e) => setBedsTotal(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded"
            placeholder="Total beds"
            min="1"
          />
          <button
            onClick={handleSetup}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Save Property
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSimulate}
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Simulate Bookings
          </button>
        </div>

        {message && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-center">
            {message}
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-blue-600 underline">View Availability</a>
        </div>
      </div>
    </div>
  )
}