import axios from 'axios';
import Router from 'next/router';
import { toast } from 'react-toastify';

let isLoggingOut = false;

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', () => {
    isLoggingOut = false;
  });
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const storage = localStorage.getItem('blog-master-auth');
      const tokenData = storage ? JSON.parse(storage) : null;
      const token = tokenData?.token?.replace(/^"|"$/g, '');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token retrieval error:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      try {
        localStorage.removeItem('blog-master-auth');
        localStorage.clear();

        toast.error('Session expired. Please log in again.', {
          toastId: 'session-expired',
        });

        const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/');
        const redirectPath = isAdminRoute ? '/admin/login' : '/login';

        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = redirectPath;
          } else {
            Router.replace(redirectPath);
          }
        }, 300);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
