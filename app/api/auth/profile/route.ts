import { NextRequest, NextResponse } from 'next/server';
import { IdentityService } from '../../../../lib/services/identity/service';
import { UpdateProfileRequest } from '../../../../lib/services/identity/types';
import { requireAuth, AuthenticatedRequest } from '../../../../lib/auth';

async function handleGET(request: AuthenticatedRequest) {
  try {
    const userId = request.user?.userId;
    const tenantId = request.user?.tenantId;

    if (!userId || !tenantId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const user = await IdentityService.getProfile(userId, tenantId);

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function handlePUT(request: AuthenticatedRequest) {
  try {
    const userId = request.user?.userId;
    const tenantId = request.user?.tenantId;

    if (!userId || !tenantId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const body: UpdateProfileRequest = await request.json();
    const user = await IdentityService.updateProfile(userId, body, tenantId);

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

// Apply authentication middleware
export const GET = requireAuth(handleGET);
export const PUT = requireAuth(handlePUT);