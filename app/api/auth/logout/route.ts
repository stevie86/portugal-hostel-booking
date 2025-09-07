import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '../../../../lib/auth';

async function handlePOST(request: AuthenticatedRequest) {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage/cookies
    // We can optionally implement token blacklisting here for enhanced security

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Apply authentication middleware (optional for logout, but good practice)
export const POST = requireAuth(handlePOST);