export interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  bedsTotal: number;
}

export interface Room {
  id: string;
  tenantId: string;
  propertyId: string;
  roomTypeId: string;
  name: string;
  floor?: number;
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  roomType?: RoomType;
  amenities?: RoomAmenity[];
}

export interface RoomAmenity {
  id: string;
  roomId: string;
  amenityId: string;
  amenity?: Amenity;
}

export interface Amenity {
  id: string;
  name: string;
}

export interface CreateRoomRequest {
  propertyId: string;
  roomTypeId: string;
  name: string;
  floor?: number;
  tenantId?: string;
}

export interface UpdateRoomRequest {
  name?: string;
  floor?: number;
  isActive?: boolean;
}