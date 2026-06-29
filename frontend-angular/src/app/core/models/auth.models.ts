import { ApiResponse } from './api-response';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthData {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  enabled: boolean;
  roles: string[];
}

export type AuthResponse = ApiResponse<AuthData>;
export type UserResponse = ApiResponse<UserData>;
