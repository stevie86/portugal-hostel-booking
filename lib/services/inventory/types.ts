export interface Room {
  id: string;
  propertyId: string;
  name: string;
  bedsTotal: number;
  hasBathroom: boolean;
  // Extra fields from schema (ignored in MVP)
  tenantId?: string;
  roomTypeId?: string;
  floor?: number;
  isActive?: boolean;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoomRequest {
  propertyId: string;
  name: string;
  bedsTotal: number;
  hasBathroom: boolean;
  // Extra fields (ignored in MVP)
  tenantId?: string;
  roomTypeId?: string;
  floor?: number;
}

export interface UpdateRoomRequest {
  name?: string;
  bedsTotal?: number;
  hasBathroom?: boolean;
  // Extra fields (ignored in MVP)
  floor?: number;
  isActive?: boolean;
}