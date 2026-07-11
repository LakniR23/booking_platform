import apiClient from './apiClient';
import type { Booking } from '../types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

export interface BookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus | 'ALL';
  serviceId?: string;
  date?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export async function getBookings(query: BookingQuery = {}): Promise<Paginated<Booking>> {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  if (query.search) params.search = query.search;
  if (query.status && query.status !== 'ALL') params.status = query.status;
  if (query.serviceId && query.serviceId !== 'ALL') params.serviceId = query.serviceId;
  if (query.date) params.date = query.date;

  const res = await apiClient.get<Paginated<Booking>>('/bookings', { params });
  return res.data;
}

export async function getBooking(id: string): Promise<Booking> {
  const res = await apiClient.get<Booking>(`/bookings/${id}`);
  return res.data;
}

export async function createBooking(payload: BookingInput): Promise<Booking> {
  const res = await apiClient.post<Booking>('/bookings', payload);
  return res.data;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  const res = await apiClient.patch<Booking>(`/bookings/${id}/status`, { status });
  return res.data;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await apiClient.patch<Booking>(`/bookings/${id}/cancel`);
  return res.data;
}
