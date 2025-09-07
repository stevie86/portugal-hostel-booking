import { NextResponse } from 'next/server';
import { InventoryService } from '../../../lib/services/inventory/service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const rooms = await InventoryService.getRooms(propertyId);

    return NextResponse.json({
      success: true,
      data: rooms
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