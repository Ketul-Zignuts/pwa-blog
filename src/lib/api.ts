import axios from 'axios';
import Router from 'next/router';
import { toast } from 'react-toastify';

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
        if (status === 401) {
            try {
                localStorage.removeItem('blog-master-auth');
                localStorage.clear();
                if(window && window !== undefined){
                    window.location.href = '/login';
                }else{
                    Router && Router.replace('/login');
                }
                toast.error('Session expired. Please log in again.')
            } catch (err) {
                console.error('Logout error:', err);
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;
