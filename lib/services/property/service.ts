import { prisma } from '../../prisma';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from './types';

const DEFAULT_TENANT_ID = 'default-tenant';

export class PropertyService {
  static async getProperties(tenantId: string = DEFAULT_TENANT_ID): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: { tenantId, isActive: true },
      include: {
        host: true,
        location: {
          include: {
            city: true
          }
        },
        rooms: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return properties;
  }

  static async getPropertyById(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<Property | null> {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        host: true,
        location: {
          include: {
            city: true
          }
        },
        rooms: true,
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    });

    if (property && property.tenantId !== tenantId) {
      return null;
    }

    return property;
  }

  static async createProperty(data: CreatePropertyRequest): Promise<Property> {
    const { tenantId = DEFAULT_TENANT_ID, ...propertyData } = data;

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        tenantId
      },
      include: {
        host: true,
        location: {
          include: {
            city: true
          }
        }
      }
    });

    return property;
  }

  static async updateProperty(id: string, data: UpdatePropertyRequest, tenantId: string = DEFAULT_TENANT_ID): Promise<Property> {
    const property = await prisma.property.update({
      where: { id },
      data,
      include: {
        host: true,
        location: {
          include: {
            city: true
          }
        }
      }
    });

    return property;
  }

  static async deleteProperty(id: string, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    await prisma.property.update({
      where: { id },
      data: { isActive: false }
    });
  }
}