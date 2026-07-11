import apiClient from './apiClient';
import type { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>('/auth/register', payload);
  return res.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/auth/login', payload);
  return res.data;
}
