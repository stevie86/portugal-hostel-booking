import { NextResponse } from 'next/server';
import { InventoryService } from '../../../../lib/services/inventory/service';

// Check if we're in demo mode (Vercel preview or DEMO_READONLY env var)
const isDemoMode = () => {
  return process.env.VERCEL_ENV === 'preview' ||
         process.env.DEMO_READONLY === 'true' ||
         process.env.VERCEL_URL?.includes('vercel-preview');
};

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const rooms = await InventoryService.getRooms();
    const room = rooms.find(r => r.id === id);

    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: room,
      ...(isDemoMode() && { demo: true })
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (isDemoMode()) {
      // In demo mode, return success without persisting
      return NextResponse.json({
        success: true,
        data: { id, ...body },
        demo: true,
        message: 'Demo mode: changes are not persisted'
      });
    }

    const updatedRoom = await InventoryService.updateRoom(id, body);

    return NextResponse.json({
      success: true,
      data: updatedRoom
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (isDemoMode()) {
      // In demo mode, return success without persisting
      return NextResponse.json({
        success: true,
        message: 'Room deleted successfully (demo mode)',
        demo: true
      });
    }

    await InventoryService.deleteRoom(id);

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}