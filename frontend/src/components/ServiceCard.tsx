import { Clock, DollarSign, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  /** "customer" = Home page booking card, "manage" = Services page card */
  variant?: 'customer' | 'manage';
  onSelect?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  variant = 'customer',
  onSelect,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const initial = service.title.charAt(0).toUpperCase();

  if (variant === 'manage') {
    return (
      <div className="group flex flex-col rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(10,22,40,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(10,22,40,0.12)]">
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white ${
              service.isActive
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-br from-slate-300 to-slate-400'
            }`}
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="truncate text-lg font-bold leading-snug text-[var(--color-heading)]">
              {service.title}
            </h3>
            <span
              className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium ${
                service.isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  service.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              {service.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <p className="mb-5 line-clamp-2 text-sm text-slate-500">
          {service.description || 'No description'}
        </p>

        {/* Coin stack */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex h-11 items-center">
            <div className="z-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-slate-500 shadow-sm">
              <Clock size={16} />
            </div>
            <div className="z-10 -ml-4 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[var(--color-brand-indigo)] text-white shadow-md">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-sm leading-tight">
            <span className="font-bold text-[var(--color-heading)]">
              ${service.price.toFixed(2)}
            </span>
            <span className="text-slate-400"> · {service.duration} min</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onEdit?.(service)}
            className="btn btn-ghost flex-1 px-2.5 py-1.5"
          >
            <Edit2 size={15} /> Edit
          </button>
          <button
            onClick={() => onDelete?.(service)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect?.(service)}
      className="group flex cursor-pointer flex-col rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(10,22,40,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(10,22,40,0.12)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-indigo)] to-[var(--color-brand-navy)] text-lg font-bold text-white">
          {initial}
        </div>
        <h3 className="min-w-0 truncate text-lg font-bold leading-snug text-[var(--color-heading)]">
          {service.title}
        </h3>
      </div>

      <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
        {service.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative flex h-11 items-center">
            <div className="z-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-slate-500 shadow-sm">
              <Clock size={16} />
            </div>
            <div className="z-10 -ml-4 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[var(--color-brand-indigo)] text-white shadow-md">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="ml-3 text-sm leading-tight">
            <div className="font-bold text-[var(--color-heading)]">${service.price.toFixed(2)}</div>
            <div className="text-xs text-slate-400">{service.duration} min</div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-2.5 group-hover:bg-[var(--color-brand-indigo)]">
          Book
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}