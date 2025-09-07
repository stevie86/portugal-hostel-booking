import { prisma } from '../../prisma';
import { Room, CreateRoomRequest, UpdateRoomRequest } from './types';

export class InventoryService {
  static async getRooms(propertyId?: string): Promise<Room[]> {
    const rooms = await prisma.room.findMany({
      where: {
        ...(propertyId && { propertyId })
      },
      orderBy: { createdAt: 'desc' }
    });

    return rooms;
  }

  static async getRoomById(id: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({
      where: { id }
    });

    return room;
  }

  static async createRoom(data: CreateRoomRequest): Promise<Room> {
    const room = await prisma.room.create({
      data: {
        ...data,
        hasBathroom: data.hasBathroom ?? false
      }
    });

    return room;
  }

  static async updateRoom(id: string, data: UpdateRoomRequest): Promise<Room> {
    const room = await prisma.room.update({
      where: { id },
      data
    });

    return room;
  }

  static async deleteRoom(id: string): Promise<void> {
    await prisma.room.delete({
      where: { id }
    });
  }
}