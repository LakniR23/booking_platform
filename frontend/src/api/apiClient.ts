import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight refresh so concurrent 401s trigger only one refresh call.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  // Use a bare axios call to avoid interceptor recursion.
  const res = await axios.post<{ access_token: string; refresh_token: string }>(
    `${BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken },
  );
  localStorage.setItem('token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res.data.access_token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Don't try to refresh for the auth endpoints themselves.
    const url: string = original?.url ?? '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');

    if (status === 401 && original && !original._retry && !isAuthCall) {
      if (!localStorage.getItem('refresh_token')) {
        logout();
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch (refreshError) {
        refreshPromise = null;
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
