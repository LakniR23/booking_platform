import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { createService, updateService } from '../api/services';
import type { Service } from '../types';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    price: 0,
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description || '',
        duration: service.duration,
        price: service.price,
        isActive: service.isActive,
      });
    } else {
      setFormData({ title: '', description: '', duration: 30, price: 0, isActive: true });
    }
  }, [service, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (service) {
        return updateService(service.id, data);
      }
      return createService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(service ? 'Service updated!' : 'Service created!');
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
      <div className="card w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)] text-white shadow-md">
            <Plus size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight" style={{ color: 'var(--color-heading)' }}>{service ? 'Edit Service' : 'Add Service'}</h2>
            <p className="text-xs text-slate-400">{service ? 'Update the details below' : 'Fill in the details to create a service'}</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}
          className="flex flex-col gap-3 px-6 py-5"
        >
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input required type="text" className="field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea rows={2} className="field resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Duration (mins)</label>
              <input required type="number" min="1" className="field" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Price ($)</label>
              <input required type="number" step="0.01" min="0" className="field" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-700">Service is active</p>
              <p className="text-xs text-slate-400">Inactive services can't be booked.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formData.isActive}
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                formData.isActive ? 'bg-[var(--color-brand-indigo)]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  formData.isActive ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn btn-accent">
              {mutation.isPending ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
