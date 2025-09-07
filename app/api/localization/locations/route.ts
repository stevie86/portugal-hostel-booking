import { NextRequest, NextResponse } from 'next/server';
import { LocalizationService } from '../../../../lib/services/localization/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId') || undefined;

    const locations = await LocalizationService.getLocations({ cityId });

    return NextResponse.json({
      success: true,
      data: locations
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}