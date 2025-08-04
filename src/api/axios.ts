/**
 * Axios instance configuration for API requests.
 *
 * This module exports a pre-configured Axios instance with:
 * - Base URL set from API_URL in config.
 * - Request interceptor that attaches a Bearer token from localStorage (if present) to the Authorization header.
 *
 * @module axios
 */

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
