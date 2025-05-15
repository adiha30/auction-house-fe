import axios from 'axios';
import { API_URL } from './config';

const instance = axios.create({
    baseURL: API_URL,
});

export const attachAuthInterceptor = (getToken: () => string | null,
                                      onLogout: () => void) => {
    instance.interceptors.request.use(config => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    });

    instance.interceptors.response.use(
        res => res,
        err => {
            if (err.response?.status === 401 || err.response?.status === 403) {
                onLogout();
            }

            return Promise.reject(err);
        }
    );
};

export default instance;