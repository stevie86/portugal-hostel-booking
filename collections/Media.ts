import type { CollectionConfig } from 'payload';

/**
 * Media Collection Configuration
 * Handles file uploads and image management for the CMS
 * Automatically generates multiple image sizes for different use cases
 */
const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media', // Directory where files are stored
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre', // Crop position for resizing
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
  ],
};

export default Media;