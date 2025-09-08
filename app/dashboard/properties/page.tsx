'use client'

import React, { useState, useEffect } from 'react';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface Property {
  id: string;
  name: string;
  description?: string;
  locationId: string;
  hostId: string;
  location?: {
    address: string;
    city?: {
      name: string;
    };
  };
  rooms?: any[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    locationId: '',
    hostId: ''
  });

  useEffect(() => {
    fetchProperties();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProperty ? `/api/properties/${editingProperty.id}` : '/api/properties';
      const method = editingProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProperties();
        setShowForm(false);
        setEditingProperty(null);
        setFormData({ name: '', description: '', locationId: '', hostId: '' });
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      description: property.description || '',
      locationId: property.locationId || '',
      hostId: property.hostId || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete property?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProperty(null);
    setFormData({ name: '', description: '', locationId: '', hostId: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Properties</h1>
          <p className="mt-2 text-neutral-text-muted">
            Manage your hostel properties
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
        >
          Add Property
        </button>
      </div>

      {/* Properties List */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-text">{property.name}</h3>
                  <p className="text-sm text-neutral-text-muted">
                    {property.location?.city?.name}, {property.location?.address}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="text-brand-600 hover:text-brand-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-neutral-text-muted mb-4">{property.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-text-muted">
                  {property.rooms?.length || 0} rooms
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-text-muted mb-4">No properties found</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-600 text-white px-6 py-3 rounded-md hover:bg-brand-700 transition-colors duration-200"
          >
            Add Your First Property
          </button>
        </div>
      )}

      {/* Property Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingProperty ? 'Edit Property' : 'Add Property'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-1">
                  Property Name
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-neutral-bg text-neutral-text px-4 py-2 rounded-md hover:bg-neutral-bg-muted transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}