import type { CollectionConfig } from 'payload';

/**
 * Properties Collection Configuration
 * Defines the structure for hostel/property listings in the CMS
 */
const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    // Basic Property Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the hostel or property',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of the property',
      },
    },

    // Location Information
    {
      name: 'location',
      type: 'group',
      admin: {
        description: 'Geographic location details',
      },
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            description: 'City where the property is located',
          },
        },
        {
          name: 'address',
          type: 'text',
          required: true,
          admin: {
            description: 'Full street address',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          admin: {
            description: 'GPS coordinates for mapping',
          },
          fields: [
            {
              name: 'lat',
              type: 'number',
              admin: {
                description: 'Latitude coordinate',
              },
            },
            {
              name: 'lng',
              type: 'number',
              admin: {
                description: 'Longitude coordinate',
              },
            },
          ],
        },
      ],
    },

    // Media Assets
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Property images and photos',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload property image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
      ],
    },

    // Property Features
    {
      name: 'amenities',
      type: 'array',
      admin: {
        description: 'Available amenities and facilities',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Name of the amenity',
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon identifier or class name',
          },
        },
      ],
    },

    // Pricing Information
    {
      name: 'priceRange',
      type: 'group',
      admin: {
        description: 'Price range for the property',
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          required: true,
          admin: {
            description: 'Minimum price per night',
          },
        },
        {
          name: 'max',
          type: 'number',
          required: true,
          admin: {
            description: 'Maximum price per night',
          },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'EUR',
          admin: {
            description: 'Currency code (e.g., EUR, USD)',
          },
        },
      ],
    },

    // Relationships
    {
      name: 'host',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Property owner/host',
      },
    },

    // Room Configuration
    {
      name: 'rooms',
      type: 'array',
      admin: {
        description: 'Available room types and configurations',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Room name or identifier',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Private Room', value: 'private' },
            { label: 'Dormitory', value: 'dorm' },
            { label: 'Shared Room', value: 'shared' },
          ],
          required: true,
          admin: {
            description: 'Type of accommodation',
          },
        },
        {
          name: 'capacity',
          type: 'number',
          required: true,
          admin: {
            description: 'Maximum number of guests',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per night for this room',
          },
        },
        {
          name: 'available',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this room currently available?',
          },
        },
      ],
    },
  ],
};

export default Properties;