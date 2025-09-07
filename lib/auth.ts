import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IdentityService } from './services/identity/service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    tenantId: string;
    role: string;
  };
}

export async function authenticateRequest(request: NextRequest): Promise<{
  user: { userId: string; tenantId: string; role: string } | null;
  response: NextResponse | null;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return {
        user: null,
        response: NextResponse.json(
          { success: false, error: 'No token provided' },
          { status: 401 }
        )
      };
    }

    const decoded = IdentityService.verifyToken(token);

    return {
      user: {
        userId: decoded.userId,
        tenantId: decoded.tenantId,
        role: decoded.role
      },
      response: null
    };
  } catch (error) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    };
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const { user, response } = await authenticateRequest(request);

    if (response) {
      return response;
    }

    // Add user to request
    (request as AuthenticatedRequest).user = user!;

    return handler(request, context);
  };
}

export function requireRole(roles: string[]) {
  return (handler: Function) => {
    return requireAuth(async (request: AuthenticatedRequest, context?: any) => {
      if (!request.user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!roles.includes(request.user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request, context);
    });
  };
}

// Client-side authentication utilities
export class AuthClient {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Try cookie first, then localStorage for backward compatibility
    const Cookies = require('js-cookie');
    return Cookies.get('authToken') || localStorage.getItem('authToken');
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    const Cookies = require('js-cookie');
    // Set both cookie and localStorage for compatibility
    Cookies.set('authToken', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    localStorage.setItem('authToken', token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    const Cookies = require('js-cookie');
    Cookies.remove('authToken');
    localStorage.removeItem('authToken');
  }

  static getAuthHeaders(): { Authorization?: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}