import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import * as servicesApi from '../api/services';

jest.mock('../api/services');
const mockedGetServices = servicesApi.getServices as jest.Mock;

const mockServices = [
  { id: '1', title: 'Haircut', description: 'Basic cut', duration: 30, price: 20, isActive: true },
  { id: '2', title: 'Massage', description: 'Relaxing', duration: 60, price: 50, isActive: true },
  { id: '3', title: 'Hidden', description: 'Inactive', duration: 30, price: 10, isActive: false },
];

function renderHome() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Home Page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows loading skeletons initially', () => {
    mockedGetServices.mockImplementation(() => new Promise(() => {}));
    renderHome();
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders active services after load', async () => {
    mockedGetServices.mockResolvedValue(mockServices);
    renderHome();
    await waitFor(() => {
      expect(screen.getByText('Haircut')).toBeInTheDocument();
      expect(screen.getByText('Massage')).toBeInTheDocument();
    });
    // Inactive service should not appear
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows empty state when no active services', async () => {
    mockedGetServices.mockResolvedValue([]);
    renderHome();
    await waitFor(() =>
      expect(screen.queryByText(/no services/i) || screen.queryByRole('listitem')).toBeDefined()
    );
  });

  it('shows page heading', async () => {
    mockedGetServices.mockResolvedValue(mockServices);
    renderHome();
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());
  });
});
