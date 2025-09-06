import type { CollectionConfig } from 'payload';

/**
 * Users Collection Configuration
 * Manages user accounts for the Portugal Hostel Booking platform
 * Includes authentication and role-based access control
 */
const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Enable authentication for this collection
  admin: {
    useAsTitle: 'email', // Display email as the title in admin panel
  },
  fields: [
    // Authentication Fields
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'User email address (used for login)',
      },
    },

    // Profile Information
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description: 'User first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description: 'User last name',
      },
    },

    // Role and Permissions
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Host', value: 'host' },
        { label: 'Guest', value: 'guest' },
      ],
      defaultValue: 'guest',
      admin: {
        description: 'User role determines access permissions',
      },
    },
  ],
};

export default Users;