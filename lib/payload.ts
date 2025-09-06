import { getPayload } from 'payload';
import config from '../payload.config';

/**
 * Payload CMS Client
 * Provides a configured Payload instance for database operations
 * This client is used throughout the application to interact with CMS data
 */
export const getPayloadClient = async () => {
  try {
    return await getPayload({
      config,
    });
  } catch (error) {
    console.error('Failed to initialize Payload client:', error);
    throw new Error('CMS connection failed');
  }
};