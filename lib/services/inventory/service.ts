import { prisma } from '../../prisma';
import { Room, CreateRoomRequest, UpdateRoomRequest } from './types';

const DEFAULT_TENANT_ID = 'default-tenant';

export class InventoryService {
  static async getRooms(propertyId?: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Room[]> {
    const rooms = await prisma.room.findMany({
      where: {
        tenantId,
        isActive: true,
        ...(propertyId && { propertyId })
      },
      include: {
        roomType: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return rooms;
  }

  static async getRoomById(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Room | null> {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    });

    if (room && room.tenantId !== tenantId) {
      return null;
    }

    return room;
  }

  static async createRoom(data: CreateRoomRequest): Promise<Room> {
    const { tenantId = DEFAULT_TENANT_ID, ...roomData } = data;

    const room = await prisma.room.create({
      data: {
        ...roomData,
        tenantId
      },
      include: {
        roomType: true
      }
    });

    return room;
  }

  static async updateRoom(id: string, data: UpdateRoomRequest, tenantId: string = DEFAULT_TENANT_ID): Promise<Room> {
    const room = await prisma.room.update({
      where: { id },
      data,
      include: {
        roomType: true
      }
    });

    return room;
  }

  static async deleteRoom(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    await prisma.room.update({
      where: { id },
      data: { isActive: false }
    });
  }
}