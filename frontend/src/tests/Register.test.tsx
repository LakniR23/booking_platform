import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import * as authApi from '../api/auth';

jest.mock('../api/auth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockedRegister = authApi.register as jest.Mock;

function renderRegister() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Register Page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the registration form', () => {
    renderRegister();
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('calls register API on submit', async () => {
    mockedRegister.mockResolvedValue({ message: 'User registered successfully' });
    renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() =>
      expect(mockedRegister).toHaveBeenCalledWith({
        name: 'Alice', email: 'alice@test.com', password: 'pass123',
      })
    );
  });

  it('shows error on failed registration', async () => {
    mockedRegister.mockRejectedValue({
      response: { data: { message: 'User with this email already exists' } },
    });
    renderRegister();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() =>
      expect(screen.getByText('User with this email already exists')).toBeInTheDocument()
    );
  });

  it('has a link to login', () => {
    renderRegister();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
