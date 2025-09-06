import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '../../../lib/payload';

/**
 * GET /api/properties
 * Fetches all properties from the CMS
 * Supports query parameters for filtering, sorting, and pagination
 */
export async function GET(request) {
  try {
    const payload = await getPayloadClient();

    // Parse query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const city = searchParams.get('city');

    // Build query with optional filters
    const query = {
      collection: 'properties',
      limit,
      page,
    };

    // Add city filter if provided
    if (city) {
      query.where = {
        'location.city': {
          equals: city,
        },
      };
    }

    const properties = await payload.find(query);

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch properties',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}