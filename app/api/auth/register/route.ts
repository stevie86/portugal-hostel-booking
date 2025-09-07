import { NextRequest, NextResponse } from 'next/server';
import { IdentityService } from '../../../../lib/services/identity/service';
import { RegisterRequest } from '../../../../lib/services/identity/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    const user = await IdentityService.register(body);

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}