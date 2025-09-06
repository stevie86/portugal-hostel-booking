import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import Users from './collections/Users';
import Properties from './collections/Properties';
import Media from './collections/Media';
import Pages from './collections/Pages';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  collections: [
    Users,
    Properties,
    Media,
    Pages,
    // Add more collections here
  ],
  routes: {
    admin: '/admin',
  },
  admin: {
    user: 'users',
    meta: {
      title: 'Portugal Hostel Booking CMS',
      description: 'Manage hostels and content for Portugal Hostel Booking',
    },
    components: {
      // Add custom components here
    },
  },
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Portuguese',
        code: 'pt',
      },
      {
        label: 'German',
        code: 'de',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }) as any,
  typescript: {
    outputFile: 'payload-types.ts',
  },
  plugins: [],
});