import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma';
import { User, RegisterRequest, LoginRequest, AuthResponse, UpdateProfileRequest, ChangePasswordRequest, TokenPayload, UserRole } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Default tenant ID for MVP
const DEFAULT_TENANT_ID = 'default-tenant';

export class IdentityService {
  static async ensureTenantExists(tenantId: string): Promise<void> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      await prisma.tenant.create({
        data: {
          id: tenantId,
          name: 'Default Tenant',
          domain: null
        }
      });
    }
  }

  static async register(data: RegisterRequest): Promise<User> {
    const { email, password, firstName, lastName, role = UserRole.GUEST, tenantId = DEFAULT_TENANT_ID } = data;

    // Ensure tenant exists
    await this.ensureTenantExists(tenantId);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId } }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        tenantId
      }
    });

    return user;
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password, tenantId = DEFAULT_TENANT_ID } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId } }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  static async getProfile(userId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.tenantId !== tenantId) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateProfile(userId: string, data: UpdateProfileRequest, tenantId: string = DEFAULT_TENANT_ID): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    return user;
  }

  static async changePassword(userId: string, data: ChangePasswordRequest, tenantId: string = DEFAULT_TENANT_ID): Promise<void> {
    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.tenantId !== tenantId) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  static generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}