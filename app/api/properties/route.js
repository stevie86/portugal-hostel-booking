import { NextResponse } from 'next/server';
import { PropertyService } from '../../../lib/services/property/service';

export async function GET(request) {
  try {
    const properties = await PropertyService.getProperties();

    return NextResponse.json({
      success: true,
      data: properties
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

    const property = await PropertyService.createProperty(body);

    return NextResponse.json({
      success: true,
      data: property
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}