import type { CollectionConfig } from 'payload';

/**
 * Pages Collection Configuration
 * Manages static content pages like About, Terms, Privacy Policy, etc.
 * Supports SEO metadata and publication status
 */
const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title', // Display page title in admin panel
  },
  fields: [
    // Page Content
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title displayed in browser and navigation',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the page (e.g., "about", "terms")',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main content of the page',
      },
    },

    // SEO and Metadata
    {
      name: 'meta',
      type: 'group',
      admin: {
        description: 'SEO and social media metadata',
      },
      fields: [
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords for SEO',
          },
        },
      ],
    },

    // Publication Settings
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this page is publicly visible',
      },
    },
  ],
};

export default Pages;