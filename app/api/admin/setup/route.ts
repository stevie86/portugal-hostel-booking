import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-admin-token')
  if (authHeader !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { propertyName, rooms } = await request.json()

    // Delete existing data
    await prisma.booking.deleteMany()
    await prisma.room.deleteMany()
    await prisma.property.deleteMany()

    // Get or create default tenant
    let tenant = await prisma.tenant.findUnique({
      where: { id: 'default-tenant' }
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          id: 'default-tenant',
          name: 'Default Tenant',
          domain: null
        }
      });
    }

    // Get or create default location
    let location = await prisma.location.findFirst();
    if (!location) {
      // Create a default city and region first
      let country = await prisma.country.findFirst();
      if (!country) {
        country = await prisma.country.create({
          data: { name: 'Portugal', code: 'PT' }
        });
      }

      let region = await prisma.region.findFirst();
      if (!region) {
        region = await prisma.region.create({
          data: { name: 'Lisbon', countryId: country.id }
        });
      }

      let city = await prisma.city.findFirst();
      if (!city) {
        city = await prisma.city.create({
          data: { name: 'Lisbon', regionId: region.id }
        });
      }

      location = await prisma.location.create({
        data: {
          address: 'Default Address',
          cityId: city.id
        }
      });
    }

    // Get or create default host user
    let host = await prisma.user.findFirst({
      where: { role: 'HOST' }
    });

    if (!host) {
      host = await prisma.user.create({
        data: {
          email: 'admin@hostel.com',
          password: 'hashedpassword', // This should be properly hashed
          firstName: 'Admin',
          lastName: 'Host',
          role: 'HOST',
          tenantId: tenant.id
        }
      });
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        name: propertyName,
        tenantId: tenant.id,
        locationId: location.id,
        hostId: host.id
      },
    })

    // Get or create default room type
    let roomType = await prisma.roomType.findFirst();
    if (!roomType) {
      roomType = await prisma.roomType.create({
        data: {
          name: 'Standard Room',
          description: 'Standard hostel room',
          capacity: 4,
          bedsTotal: 4
        }
      });
    }

    // Create rooms
    for (const room of rooms) {
      await prisma.room.create({
        data: {
          name: room.name,
          propertyId: property.id,
          roomTypeId: roomType.id,
          tenantId: tenant.id
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}