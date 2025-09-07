import { NextResponse } from 'next/server';
import { PropertyService } from '../../../../lib/services/property/service';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const property = await PropertyService.getPropertyById(id);

    if (!property) {
      return NextResponse.json({
        success: false,
        error: 'Property not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: property
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

    const property = await PropertyService.updateProperty(id, body);

    return NextResponse.json({
      success: true,
      data: property
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

    await PropertyService.deleteProperty(id);

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}