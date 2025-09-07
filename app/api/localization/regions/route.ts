import { NextRequest, NextResponse } from 'next/server';
import { LocalizationService } from '../../../../lib/services/localization/service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId') || undefined;

    const regions = await LocalizationService.getRegions({ countryId });

    return NextResponse.json({
      success: true,
      data: regions
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}