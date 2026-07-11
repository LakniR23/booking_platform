import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import * as authApi from '../api/auth';

jest.mock('../api/auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockedLogin = authApi.login as jest.Mock;
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: (k: string) => mockLocalStorage.store[k] ?? null,
  setItem: (k: string, v: string) => { mockLocalStorage.store[k] = v; },
  removeItem: (k: string) => { delete mockLocalStorage.store[k]; },
};

beforeEach(() => {
  mockLocalStorage.store = {};
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
});

function renderLogin() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Login Page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    mockedLogin.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
  });

  it('calls login API on submit', async () => {
    mockedLogin.mockResolvedValue({
      access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1MSIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGUiOiJDVVNUT01FUiJ9.sig',
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(mockedLogin).toHaveBeenCalledWith({ email: 'a@a.com', password: 'pass' }));
  });

  it('disables button while loading', async () => {
    mockedLogin.mockImplementation(() => new Promise(() => {}));
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled());
  });
});
