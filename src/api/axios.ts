import axios from 'axios';
import {API_URL} from './config';

const instance = axios.create({
    baseURL: API_URL,
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers = config.headers ?? {};

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default instance;