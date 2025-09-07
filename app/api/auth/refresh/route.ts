import { NextRequest, NextResponse } from 'next/server';
import { IdentityService } from '../../../../lib/services/identity/service';
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

    // Get user data
    const user = await IdentityService.getProfile(userId, tenantId);

    // Generate new token
    const newToken = IdentityService.generateToken(user);

    return NextResponse.json({
      success: true,
      data: {
        user,
        token: newToken
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Apply authentication middleware
export const POST = requireAuth(handlePOST);