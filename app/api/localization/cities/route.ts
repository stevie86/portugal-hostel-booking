import { NextRequest, NextResponse } from 'next/server';
import { LocalizationService } from '../../../../lib/services/localization/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId') || undefined;

    const cities = await LocalizationService.getCities({ regionId });

    return NextResponse.json({
      success: true,
      data: cities
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}