import { NextResponse } from 'next/server';
import { InventoryService } from '../../../lib/services/inventory/service';

// Check if we're in demo mode (Vercel preview or DEMO_READONLY env var)
const isDemoMode = () => {
  return process.env.VERCEL_ENV === 'preview' ||
         process.env.DEMO_READONLY === 'true' ||
         process.env.VERCEL_URL?.includes('vercel-preview');
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const rooms = await InventoryService.getRooms(propertyId);

    return NextResponse.json({
      success: true,
      data: rooms,
      ...(isDemoMode() && { demo: true })
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (isDemoMode()) {
      // In demo mode, return success without persisting
      return NextResponse.json({
        success: true,
        data: { ...body, id: 'demo-' + Date.now() },
        demo: true,
        message: 'Demo mode: changes are not persisted'
      }, { status: 201 });
    }

    const room = await InventoryService.createRoom(body);

    return NextResponse.json({
      success: true,
      data: room
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}