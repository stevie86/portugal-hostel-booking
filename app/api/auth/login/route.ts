import { NextRequest, NextResponse } from 'next/server';
import { IdentityService } from '../../../../lib/services/identity/service';
import { LoginRequest } from '../../../../lib/services/identity/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const authResponse = await IdentityService.login(body);

    return NextResponse.json({
      success: true,
      data: authResponse
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 401 });
  }
}