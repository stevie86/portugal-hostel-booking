# Lisbon Hostel Booking MVP

Minimal working MVP for hostel booking simulation.

## Features

- **Public Page (/)**: Shows property and current room availability
- **Admin Page (/admin)**: Set up property/room and simulate bookings
- **APIs**: Setup property and simulate random bookings

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite

## Quick Start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Visit http://localhost:3000

## Usage

1. Go to `/admin`
2. Enter property name, room name, beds count
3. Click "Save Property"
4. Click "Simulate Bookings" to create test bookings
5. Go to `/` to see updated availability

## Environment

- `DATABASE_URL=file:./dev.db`
- `ADMIN_TOKEN=dev-admin`

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run db:push` - Update database schema
- `npm run db:seed` - Seed with sample data
