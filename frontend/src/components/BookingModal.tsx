import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { getServices } from '../api/services';
import { createBooking } from '../api/bookings';
import { X, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '09:00',
    notes: '',
  });
  const [error, setError] = useState('');

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      return getServices();
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return createBooking(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: '',
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: '09:00',
        notes: '',
      });
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'An error occurred';
      setError(msg);
      toast.error(msg);
    }
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="card flex max-h-[85vh] w-full max-w-md flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)] text-white shadow-md">
            <CalendarPlus size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight text-[var(--color-heading)]">Add Booking</h2>
            <p className="text-xs text-slate-400">Book a service for your customer</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="flex flex-col gap-3 overflow-y-auto px-6 py-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Service</label>
            <select
              required
              className="field"
              value={formData.serviceId}
              onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
            >
              <option value="" disabled>Select a service</option>
              {services?.filter(s => s.isActive).map(s => (
                <option key={s.id} value={s.id}>{s.title} (${s.price.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Customer Name</label>
            <input required type="text" className="field" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input required type="email" className="field" value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input required type="tel" className="field" value={formData.customerPhone} onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input required type="date" className="field" value={formData.bookingDate} onChange={e => setFormData({ ...formData, bookingDate: e.target.value })} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Time</label>
              <input required type="time" className="field" value={formData.bookingTime} onChange={e => setFormData({ ...formData, bookingTime: e.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
            <textarea rows={2} className="field resize-none" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={mutation.isPending || !formData.serviceId} className="btn btn-accent">
              {mutation.isPending ? 'Saving...' : 'Add Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
