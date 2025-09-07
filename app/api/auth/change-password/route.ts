import { NextRequest, NextResponse } from 'next/server';
import { IdentityService } from '../../../../lib/services/identity/service';
import { ChangePasswordRequest } from '../../../../lib/services/identity/types';
import { requireAuth, AuthenticatedRequest } from '../../../../lib/auth';

async function handlePOST(request: AuthenticatedRequest) {
  try {
    const userId = request.user?.userId;
    const tenantId = request.user?.tenantId;

    if (!userId || !tenantId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const body: ChangePasswordRequest = await request.json();
    await IdentityService.changePassword(userId, body, tenantId);

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}

// Apply authentication middleware
export const POST = requireAuth(handlePOST);