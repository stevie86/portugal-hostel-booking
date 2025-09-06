import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '../../../../lib/payload';

/**
 * GET /api/pages/[slug]
 * Fetches a specific page by its slug
 * Only returns published pages for security
 */
export async function GET(request, { params }) {
  try {
    // Validate slug parameter
    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { error: 'Page slug is required' },
        { status: 400 }
      );
    }

    const payload = await getPayloadClient();

    // Query for the specific page
    const page = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
        published: {
          equals: true, // Only return published pages
        },
      },
      limit: 1,
    });

    // Check if page exists
    if (page.docs.length === 0) {
      return NextResponse.json(
        { error: 'Page not found or not published' },
        { status: 404 }
      );
    }

    return NextResponse.json(page.docs[0]);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch page',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}