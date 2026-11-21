import type { ApiResponse, EndpointDefinition } from '../api.types';

export interface SendOtpRequest {
  phone: string;
  channel: 'SMS' | 'WHATSAPP' | 'VOICE';
  purpose: 'LOGIN' | 'REGISTER' | 'VERIFY' | 'RESET_PASSWORD';
}

export interface SendOtpResponse {
  otpId: string;
  expiresIn: number;
  maskedPhone: string;
}

export interface VerifyOtpRequest {
  otpId: string;
  code: string;
  deviceId?: string;
  fcmToken?: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  user: UserProfile;
  isNewUser: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  avatarUrl?: string;
  roles: UserRole[];
  societies: SocietyMembership[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  inApp: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'RESIDENTS_ONLY' | 'PRIVATE';
  showPhone: boolean;
  showEmail: boolean;
  showUnit: boolean;
}

export type UserRole =
  | 'RESIDENT_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY'
  | 'GUARD'
  | 'ADMIN'
  | 'TREASURER'
  | 'FACILITY_MANAGER'
  | 'VENDOR'
  | 'STAFF'
  | 'SUPER_ADMIN';

export interface SocietyMembership {
  societyId: string;
  societyName: string;
  unitId: string;
  unitNumber: string;
  tower: string;
  floor: number;
  role: UserRole;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED';
  joinedAt: string;
}

export const authEndpoints = {
  sendOtp: {
    method: 'POST' as const,
    path: '/auth/otp/send',
    requestBody: {} as SendOtpRequest,
    responseBody: {} as SendOtpResponse,
    authRequired: false,
  },
  verifyOtp: {
    method: 'POST' as const,
    path: '/auth/otp/verify',
    requestBody: {} as VerifyOtpRequest,
    responseBody: {} as VerifyOtpResponse,
    authRequired: false,
  },
  refreshToken: {
    method: 'POST' as const,
    path: '/auth/token/refresh',
    requestBody: {} as RefreshTokenRequest,
    responseBody: {} as RefreshTokenResponse,
    authRequired: false,
  },
  logout: {
    method: 'POST' as const,
    path: '/auth/logout',
    authRequired: true,
  },
  logoutAll: {
    method: 'POST' as const,
    path: '/auth/logout-all',
    authRequired: true,
  },
  getProfile: {
    method: 'GET' as const,
    path: '/auth/me',
    responseBody: {} as UserProfile,
    authRequired: true,
  },
  updateProfile: {
    method: 'PATCH' as const,
    path: '/auth/me',
    requestBody: {} as Partial<UserProfile>,
    responseBody: {} as UserProfile,
    authRequired: true,
  },
  updatePreferences: {
    method: 'PATCH' as const,
    path: '/auth/me/preferences',
    requestBody: {} as Partial<UserPreferences>,
    responseBody: {} as UserPreferences,
    authRequired: true,
  },
  registerDevice: {
    method: 'POST' as const,
    path: '/auth/devices',
    requestBody: {} as { deviceId: string; fcmToken: string; platform: 'ios' | 'android' | 'web' },
    responseBody: {} as { deviceId: string },
    authRequired: true,
  },
  unregisterDevice: {
    method: 'DELETE' as const,
    path: '/auth/devices/{deviceId}',
    pathParams: ['deviceId'],
    authRequired: true,
  },
} as const satisfies Record<string, EndpointDefinition>;