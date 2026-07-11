import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, deleteService } from '../api/services';
import type { Service } from '../types';
import { Plus, AlertCircle, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceModal from '../components/ServiceModal';
import ServiceCard from '../components/ServiceCard';
import toast from 'react-hot-toast';

export default function Services() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 9;
  const queryClient = useQueryClient();

  const { data: services, isLoading, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      return getServices();
    },
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
    },
    onError: () => toast.error('Failed to delete service'),
  });

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (s.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive = activeFilter === 'ALL' ||
                            (activeFilter === 'ACTIVE' && s.isActive) ||
                            (activeFilter === 'INACTIVE' && !s.isActive);
      return matchesSearch && matchesActive;
    });
  }, [services, searchTerm, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedServices = filteredServices.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-heading)]">Services</h1>
            <p className="mt-1 text-sm text-slate-500">Manage the services your customers can book.</p>
          </div>
          <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="btn btn-accent">
            <Plus size={18} /> Add Service
          </button>
        </div>

        <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchX className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              className="field field-search"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(f => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  activeFilter === f ? 'bg-[var(--color-brand-navy)] text-white shadow' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-brand-indigo)] border-t-transparent" />
          <p className="text-sm">Loading services...</p>
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-rose-500">
          <AlertCircle size={40} />
          <p className="text-lg font-semibold">Failed to load services</p>
          <p className="text-sm text-slate-500">{(error as any)?.message || 'Please check your connection and try again.'}</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['services'] })}
            className="btn btn-ghost mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services?.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-400">
                <p className="text-lg">No services yet.</p>
                <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="text-sm font-medium text-[var(--color-brand-indigo)] hover:opacity-80">
                  Add your first service
                </button>
              </div>
            )}

            {services && services.length > 0 && filteredServices.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-400">
                <SearchX size={36} />
                <p className="text-lg">No services match your search.</p>
                <button onClick={() => { setSearchTerm(''); setActiveFilter('ALL'); setPage(1); }} className="text-sm font-medium text-[var(--color-brand-indigo)] hover:opacity-80">
                  Clear filters
                </button>
              </div>
            )}

            {paginatedServices.map(service => (
              <ServiceCard
                key={service.id}
                variant="manage"
                service={service}
                onEdit={(s) => { setEditingService(s); setIsModalOpen(true); }}
                onDelete={(s) => { if (confirm('Are you sure?')) deleteMutation.mutate(s.id); }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="text-sm text-slate-500">
                Showing {Math.min((currentPage - 1) * limit + 1, filteredServices.length)}–
                {Math.min(currentPage * limit, filteredServices.length)} of {filteredServices.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-slate-400">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                          p === currentPage
                            ? 'bg-[var(--color-brand-navy)] text-white shadow'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="btn btn-ghost inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} service={editingService} />
    </div>
  );
}
