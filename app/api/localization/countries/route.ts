import { NextRequest, NextResponse } from 'next/server';
import { LocalizationService } from '../../../../lib/services/localization/service';

export async function GET(request: NextRequest) {
  try {
    const countries = await LocalizationService.getCountries();

    return NextResponse.json({
      success: true,
      data: countries
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}