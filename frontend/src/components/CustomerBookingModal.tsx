import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { createBooking } from '../api/bookings';
import type { Service } from '../types';
import { CalendarCheck, X } from 'lucide-react';

interface CustomerBookingModalProps {
  service: Service;
  onClose: () => void;
}

export default function CustomerBookingModal({ service, onClose }: CustomerBookingModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return createBooking(data);
    },
    onSuccess: () => {
      alert('Booking successful!');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to book');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      serviceId: service.id,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      bookingDate: date,
      bookingTime: time,
      notes,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)] text-white shadow-md">
            <CalendarCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight text-[var(--color-heading)]">Book {service.title}</h2>
            <p className="text-xs text-slate-400">Confirm the details to reserve</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" required className="field" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input type="email" required className="field" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" required className="field" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input type="date" required className="field" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Time</label>
                <input type="time" required className="field" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
              <textarea className="field h-20 resize-none" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn btn-accent">
              {mutation.isPending ? 'Booking...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
