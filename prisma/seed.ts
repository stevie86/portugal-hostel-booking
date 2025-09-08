import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create Lisbon Starter Hostel
  const property = await prisma.property.upsert({
    where: { id: 'lisbon-starter-hostel' },
    update: {},
    create: {
      id: 'lisbon-starter-hostel',
      name: 'Lisbon Starter Hostel',
      city: 'Lisbon',
    },
  })

  // Create sample rooms: 1 dorm + 1 private
  const rooms = [
    { name: '6-Bed Mixed Dorm', bedsTotal: 6, hasBathroom: false },
    { name: 'Private Double Room', bedsTotal: 2, hasBathroom: true },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: `${room.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` },
      update: {},
      create: {
        id: `${room.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        name: room.name,
        bedsTotal: room.bedsTotal,
        hasBathroom: room.hasBathroom,
        propertyId: property.id,
      },
    })
  }

  console.log('Database seeded successfully with Lisbon Starter Hostel')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })