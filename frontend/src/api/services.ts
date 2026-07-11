import apiClient from './apiClient';
import type { Service } from '../types';

export interface ServiceInput {
  title: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
}

export async function getServices(): Promise<Service[]> {
  const res = await apiClient.get<Service[]>('/services');
  return res.data;
}

export async function getService(id: string): Promise<Service> {
  const res = await apiClient.get<Service>(`/services/${id}`);
  return res.data;
}

export async function createService(payload: ServiceInput): Promise<Service> {
  const res = await apiClient.post<Service>('/services', payload);
  return res.data;
}

export async function updateService(id: string, payload: Partial<ServiceInput>): Promise<Service> {
  const res = await apiClient.patch<Service>(`/services/${id}`, payload);
  return res.data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}
