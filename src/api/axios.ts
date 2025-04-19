import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const attachAuthInterceptor = (getToken: () => string | null) => {
    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (getToken()) config.headers.Authorization = `Bearer ${token}`;

        return config;
    });
};

export default instance;