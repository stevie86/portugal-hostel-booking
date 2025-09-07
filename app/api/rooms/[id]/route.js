import { NextResponse } from 'next/server';
import { InventoryService } from '../../../../lib/services/inventory/service';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // For now, return a mock room - in real implementation, you'd fetch by ID
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
      data: room
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

    // Mock update - in real implementation, you'd update the room
    const updatedRoom = { id, ...body };

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

    // Mock delete - in real implementation, you'd delete the room
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