import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Bookings from '../pages/Bookings';
import * as bookingsApi from '../api/bookings';
import * as servicesApi from '../api/services';

jest.mock('../api/bookings');
jest.mock('../api/services');
const mockedGetBookings = bookingsApi.getBookings as jest.Mock;
const mockedGetServices = servicesApi.getServices as jest.Mock;

const mockBookings = [
  {
    id: 'b-1', customerName: 'Alice', customerEmail: 'alice@example.com',
    customerPhone: '111', serviceId: 's-1', bookingDate: '2030-01-01',
    bookingTime: '10:00', status: 'PENDING', notes: '', service: { title: 'Haircut' },
  },
  {
    id: 'b-2', customerName: 'Bob', customerEmail: 'bob@example.com',
    customerPhone: '222', serviceId: 's-1', bookingDate: '2030-01-02',
    bookingTime: '11:00', status: 'CONFIRMED', notes: 'window seat', service: { title: 'Massage' },
  },
];

const paginate = (rows: typeof mockBookings) => ({
  data: rows,
  meta: { total: rows.length, page: 1, limit: 10, totalPages: 1 },
});

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: () => 'mock-token', setItem: jest.fn(), removeItem: jest.fn() },
    writable: true,
  });
  mockedGetServices.mockResolvedValue([]);
  mockedGetBookings.mockImplementation((query: any = {}) => {
    let rows = mockBookings;
    if (query.search) {
      const q = query.search.toLowerCase();
      rows = rows.filter(b => b.customerName.toLowerCase().includes(q) || b.customerEmail.toLowerCase().includes(q));
    }
    if (query.status && query.status !== 'ALL') {
      rows = rows.filter(b => b.status === query.status);
    }
    return Promise.resolve(paginate(rows));
  });
});

function renderBookings() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Bookings Page', () => {
  it('always renders table headers', async () => {
    renderBookings();
    await waitFor(() => {
      expect(screen.getByText('Customer Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  it('renders booking rows after loading', async () => {
    renderBookings();
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('filters bookings by search term', async () => {
    renderBookings();
    await waitFor(() => screen.getByText('Alice'));
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'alice' } });
    await waitFor(() => {
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('filters bookings by status', async () => {
    renderBookings();
    await waitFor(() => screen.getByText('Alice'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmed' }));
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });
});
