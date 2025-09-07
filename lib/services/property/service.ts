import { prisma } from '../../prisma';

export interface Property {
  id: string;
  name: string;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyRequest {
  name: string;
  city?: string;
}

export class PropertyService {
  static async getProperties(): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return properties;
  }

  static async getPropertyById(id: string): Promise<Property | null> {
    const property = await prisma.property.findUnique({
      where: { id }
    });

    return property;
  }

  static async createProperty(data: CreatePropertyRequest): Promise<Property> {
    const property = await prisma.property.create({
      data
    });

    return property;
  }

  static async updateProperty(id: string, data: Partial<CreatePropertyRequest>): Promise<Property> {
    const property = await prisma.property.update({
      where: { id },
      data
    });

    return property;
  }

  static async deleteProperty(id: string): Promise<void> {
    await prisma.property.delete({
      where: { id }
    });
  }
}