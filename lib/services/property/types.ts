import { UserRole } from '../identity/types';

export interface Property {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  locationId: string;
  hostId: string;
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  host?: User;
  location?: Location;
  rooms?: Room[];
  amenities?: PropertyAmenity[];
}

export interface Amenity {
  id: string;
  name: string;
}

export interface PropertyAmenity {
  id: string;
  propertyId: string;
  amenityId: string;
  property?: Property;
  amenity?: Amenity;
}

export interface CreatePropertyRequest {
  name: string;
  description?: string;
  locationId: string;
  hostId: string;
  tenantId?: string;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Simplified interfaces for related models
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface Location {
  id: string;
  address: string;
  city?: City;
}

export interface City {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}