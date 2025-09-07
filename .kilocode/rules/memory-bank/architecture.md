# Architecture

## System Architecture
- **Frontend**: Next.js application with React components
- **Backend**: Next.js API routes (App Router)
- **Database**: SQLite (development) with migration path to PostgreSQL (production)
- **Authentication**: To be implemented (likely NextAuth.js or similar)
- **Payment Processing**: Integrated with multi-provider support (Stripe, MB WAY, Multibanco)
- **Notification System**: Email and SMS notifications with templated messages and delivery tracking
- **File Storage**: For property images (Cloudinary, AWS S3, or similar)
- **Internationalization**: next-intl for multi-language support

## Source Code Paths
- `/app` - Next.js App Router pages and API routes (to be migrated from /pages)
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles` - Global styles (Tailwind CSS)
- `/messages` - Internationalization messages (to be created)

## Key Technical Decisions
- **Framework**: Next.js 14 (App Router) with React 18 for SSR and performance
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks initially; consider Zustand for complex state
- **Routing**: Next.js App Router for modern routing
- **API**: RESTful API with Next.js App Router API routes
- **Database ORM**: Prisma for type-safe database access
- **Internationalization**: next-intl for English, Portuguese, German support

## Design Patterns
- **Component Composition**: Building complex UIs from smaller, reusable components
- **Custom Hooks**: For shared logic (e.g., authentication, data fetching)
- **Server Components**: Leveraging Next.js App Router for server-side rendering
- **Container/Presentational Pattern**: Separating business logic from presentation

## Component Relationships
- **Button**: Basic interactive element (to be updated for Tailwind)
- **ClickCount**: Example component (demo, to be replaced)
- **Home**: Main page component (to be replaced with booking platform)

## Notification Service Architecture
- **Email Service**: Templated email notifications using Handlebars templates
- **SMS Service**: Extensible SMS notification support (Twilio integration ready)
- **Channel Architecture**: Pluggable notification channels for future expansion
- **Delivery Tracking**: Comprehensive email delivery logging and status tracking
- **Error Handling**: Retry logic and graceful failure handling for notifications
- **Integration**: Automatic notifications triggered by booking and payment events

## Critical Implementation Paths
1. **Database Setup**: Prisma with SQLite, schema for users, properties, bookings with location data
2. **User Authentication Flow**: Registration, login, session management
3. **Property Listing Management**: CRUD operations for hosts across Portuguese cities
4. **Search and Filtering**: Location-based search with regional filters and multi-city support
5. **Booking Process**: Reservation creation, payment, confirmation
6. **Dashboard**: User/host management interfaces with nationwide property management
7. **Internationalization**: Multi-language UI implementation (English, Portuguese, German)
8. **Review System**: Rating and feedback functionality
9. **Scalability Planning**: Architecture ready for nationwide expansion and tourism data integration