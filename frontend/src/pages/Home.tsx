import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../api/services';
import type { Service } from '../types/index.ts';
import { CalendarCheck } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import SpotlightBackground from '../components/SpotlightBackground';
import CustomerBookingModal from '../components/CustomerBookingModal';

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      return getServices();
    }
  });

  const activeServices = services?.filter(s => s.isActive) || [];

  return (
    <SpotlightBackground>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-16 text-center">
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-[var(--color-heading)]">
            Premium Services, <br />
            <span className="text-gradient">Booked Instantly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Experience world-class service scheduling. Fast, reliable, and beautifully simple. Select a service below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          )}

          {!isLoading && activeServices.map(service => (
            <ServiceCard key={service.id} service={service} onSelect={setSelectedService} />
          ))}

          {!isLoading && activeServices.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-400">
              <CalendarCheck size={36} />
              <p className="text-lg">No services available right now.</p>
            </div>
          )}
        </div>

        {selectedService && (
          <CustomerBookingModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </div>
    </SpotlightBackground>
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-3 px-6 pt-6">
        <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="space-y-1.5">
            <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}