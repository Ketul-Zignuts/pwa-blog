import axios from 'axios';
import Router from 'next/router';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            let tokenData = null;

            const storage = localStorage.getItem('blog-master-auth');
            tokenData = storage ? JSON.parse(storage) : null;

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
        const message = error?.response?.data?.message || '';

        if (
            status === 401 &&
            (message.includes('Token expired') || message.includes('Invalid token'))
        ) {
            try {
                localStorage.removeItem('blog-master-auth');
                Router.replace('/login');
            } catch (err) {
                console.error('Token cleanup or redirection error:', err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
