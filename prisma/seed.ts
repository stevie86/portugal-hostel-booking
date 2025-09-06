import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a sample property
  const property = await prisma.property.upsert({
    where: { id: 'sample-property' },
    update: {},
    create: {
      id: 'sample-property',
      name: 'Sample Lisbon Hostel',
    },
  })

  // Create sample rooms
  const rooms = [
    { name: 'Dorm Room A', bedsTotal: 6 },
    { name: 'Dorm Room B', bedsTotal: 8 },
    { name: 'Private Room 1', bedsTotal: 2 },
    { name: 'Private Room 2', bedsTotal: 4 },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: `${room.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `${room.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: room.name,
        bedsTotal: room.bedsTotal,
        propertyId: property.id,
      },
    })
  }

  console.log('Database seeded successfully')
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