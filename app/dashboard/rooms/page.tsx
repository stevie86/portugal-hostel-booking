'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Room {
  id: string;
  name: string;
  propertyId: string;
  roomType?: {
    name: string;
    capacity: number;
    bedsTotal: number;
  };
  floor?: number;
}

interface Property {
  id: string;
  name: string;
}

export default function RoomsPage() {
  const t = useTranslations('dashboard');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    propertyId: '',
    name: '',
    roomType: 'private', // private, dormitory
    bedType: 'single', // single, double, bunk
    bathroomType: 'private', // private, shared
    capacity: 1,
    floor: 1
  });

  useEffect(() => {
    fetchProperties();
    fetchRooms();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const roomData = {
        propertyId: formData.propertyId,
        name: formData.name,
        roomTypeId: formData.roomType, // This should be a proper room type ID
        floor: formData.floor
      };

      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (response.ok) {
        fetchRooms();
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      propertyId: '',
      name: '',
      roomType: 'private',
      bedType: 'single',
      bathroomType: 'private',
      capacity: 1,
      floor: 1
    });
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-text-muted">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">{t('rooms')}</h1>
          <p className="mt-2 text-neutral-text-muted">
            Manage rooms and bed configurations
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
        >
          {t('addRoom')}
        </button>
      </div>

      {/* Rooms List */}
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-text">{room.name}</h3>
                  <p className="text-sm text-neutral-text-muted">
                    {getPropertyName(room.propertyId)}
                  </p>
                </div>
                <button
                  onClick={() => setEditingRoom(room)}
                  className="text-brand-600 hover:text-brand-700 text-sm"
                >
                  {t('editRoom')}
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-neutral-text-muted">
                  <span className="font-medium">{t('roomType')}:</span> {room.roomType?.name || 'N/A'}
                </p>
                <p className="text-sm text-neutral-text-muted">
                  <span className="font-medium">{t('capacity')}:</span> {room.roomType?.capacity || 0}
                </p>
                <p className="text-sm text-neutral-text-muted">
                  <span className="font-medium">Floor:</span> {room.floor || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-text-muted mb-4">No rooms found</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-600 text-white px-6 py-3 rounded-md hover:bg-brand-700 transition-colors duration-200"
          >
            {t('addRoom')}
          </button>
        </div>
      )}

      {/* Room Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoom ? t('editRoom') : t('addRoom')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  Property
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  required
                >
                  <option value="">Select Property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  {t('roomName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  {t('roomType')}
                </label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="private">{t('privateRoom')}</option>
                  <option value="dormitory">{t('dormitory')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  {t('bedType')}
                </label>
                <select
                  value={formData.bedType}
                  onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="single">{t('singleBed')}</option>
                  <option value="double">{t('doubleBed')}</option>
                  <option value="bunk">{t('bunkBed')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  {t('bathroomType')}
                </label>
                <select
                  value={formData.bathroomType}
                  onChange={(e) => setFormData({ ...formData, bathroomType: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="private">{t('privateBathroom')}</option>
                  <option value="shared">{t('sharedBathroom')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  {t('capacity')}
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  min="1"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-neutral-bg text-neutral-text px-4 py-2 rounded-md hover:bg-neutral-bg-muted transition-colors duration-200"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}