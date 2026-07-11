import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, updateBookingStatus, cancelBooking } from '../api/bookings';
import { getServices } from '../api/services';
import { Plus, AlertCircle, SearchX, Eye, X, StickyNote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import BookingModal from '../components/BookingModal';
import toast from 'react-hot-toast';

const STATUS_PILL: Record<string, string> = {
  PENDING: 'pill pill-amber',
  CONFIRMED: 'pill pill-emerald',
  COMPLETED: 'pill pill-indigo',
  CANCELLED: 'pill pill-rose',
};

export default function Bookings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [noteView, setNoteView] = useState<{ open: boolean; text: string }>({ open: false, text: '' });
  const queryClient = useQueryClient();

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    retry: 1,
  });

  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['bookings', { page, limit, search: searchTerm, status: statusFilter, serviceId: serviceFilter, date: dateFilter }],
    queryFn: () =>
      getBookings({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter,
        serviceId: serviceFilter === 'ALL' ? undefined : serviceFilter,
        date: dateFilter || undefined,
      }),
    retry: 1,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (status === 'CANCELLED') return cancelBooking(id);
      return updateBookingStatus(id, status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
    onError: () => toast.error('Failed to update booking status'),
  });

  const serviceOptions = useMemo(() => {
    const map = new Map<string, string>();
    (services ?? []).forEach(s => map.set(s.id, s.title));
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [services]);

  const bookingsData = bookings?.data ?? [];
  const meta = bookings?.meta;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setServiceFilter('ALL');
    setDateFilter('');
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };
  const onStatusChange = (value: 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    setStatusFilter(value);
    setPage(1);
  };
  const onServiceChange = (value: string) => {
    setServiceFilter(value);
    setPage(1);
  };
  const onDateChange = (value: string) => {
    setDateFilter(value);
    setPage(1);
  };
  const hasActiveFilters =
    !!searchTerm || statusFilter !== 'ALL' || serviceFilter !== 'ALL' || !!dateFilter;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-heading)]">Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">Track and manage every customer booking.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-accent">
            <Plus size={18} /> Add Booking
          </button>
        </div>

        <div className="card flex flex-col gap-3 p-4">
          {/* Row 1: search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchX className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by customer name or email..."
                className="field field-search"
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: status segmented control + compact dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    statusFilter === s ? 'bg-[var(--color-brand-navy)] text-white shadow' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-52">
              <select
                className="field"
                value={serviceFilter}
                onChange={e => onServiceChange(e.target.value)}
              >
                <option value="ALL">All services</option>
                {serviceOptions.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-44">
              <input
                type="date"
                className="field"
                value={dateFilter}
                onChange={e => onDateChange(e.target.value)}
                aria-label="Filter by booking date"
              />
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-ghost whitespace-nowrap sm:ml-auto">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-brand-indigo)] border-t-transparent" />
          <p className="text-sm">Loading bookings...</p>
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-rose-500">
          <AlertCircle size={40} />
          <p className="text-lg font-semibold">Failed to load bookings</p>
          <p className="text-sm text-slate-500">{(error as any)?.message || 'Please check your connection and try again.'}</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
            className="btn btn-ghost mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">Customer Name</th>
                  <th className="px-4 py-3 font-semibold">Customer Email</th>
                  <th className="px-4 py-3 font-semibold">Customer Phone</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Booking Date</th>
                  <th className="px-4 py-3 font-semibold">Booking Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                  <th className="px-4 py-3 text-center font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
              {bookingsData.length === 0 && !hasActiveFilters && (
                <tr>
                  <td colSpan={9} className="py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <p className="text-lg">No bookings yet.</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-[var(--color-brand-indigo)] hover:opacity-80">
                        Create the first booking
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {bookingsData.length === 0 && hasActiveFilters && (
                <tr>
                  <td colSpan={9} className="py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <SearchX size={32} />
                      <p className="text-lg">No bookings match your filters.</p>
                      <button onClick={clearFilters} className="text-sm font-medium text-[var(--color-brand-indigo)] hover:opacity-80">
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {bookingsData.map(booking => (
                  <tr key={booking.id} className="border-b border-slate-100 transition hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-800">{booking.customerName}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.customerEmail}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.customerPhone}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{booking.service?.title}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.bookingTime}</td>
                    <td className="px-4 py-3">
                      <span className={STATUS_PILL[booking.status]}>{booking.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--color-brand-indigo)]"
                        value={booking.status}
                        onChange={e => statusMutation.mutate({ id: booking.id, status: e.target.value })}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        disabled={!booking.notes}
                        onClick={() => booking.notes && setNoteView({ open: true, text: booking.notes })}
                        title={booking.notes ? 'View note' : 'No note'}
                        className={`inline-flex items-center justify-center rounded-lg p-2 transition ${
                          booking.notes
                            ? 'text-slate-400 hover:bg-slate-100 hover:text-[var(--color-brand-indigo)]'
                            : 'cursor-not-allowed text-slate-300 opacity-50'
                        }`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span>
                  Showing {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
                </span>
                <select
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-600 outline-none"
                  value={limit}
                  onChange={e => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Rows per page"
                >
                  {[10, 20, 50].map(n => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={meta.page <= 1}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-slate-400">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                          p === meta.page
                            ? 'bg-[var(--color-brand-navy)] text-white shadow'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={meta.page >= meta.totalPages}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {createPortal(
        noteView.open && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onClick={() => setNoteView({ open: false, text: '' })}
          >
            <div
              className="card w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)]" />
              <div className="flex items-start gap-3 px-6 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)] text-white shadow-md">
                  <StickyNote size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold leading-tight text-[var(--color-heading)]">Booking Note</h2>
                  <p className="text-xs text-slate-400">Additional details for this booking</p>
                </div>
                <button
                  onClick={() => setNoteView({ open: false, text: '' })}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="px-6 pb-6">
                <div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {noteView.text}
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setNoteView({ open: false, text: '' })} className="btn btn-ghost">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
}
