export type UserRole = 'ADMIN' | 'OPERATOR' | 'VENDOR';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}
