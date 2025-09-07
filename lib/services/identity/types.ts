export enum UserRole {
  ADMIN = 'ADMIN',
  HOST = 'HOST',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  tenantId?: string; // For multi-tenancy
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TokenPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
