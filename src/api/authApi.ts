/**
 * Authentication API module for user login and registration.
 * Provides functions to log in users and register new accounts.
 *
 * @module authApi
 */
import api from './axios';

/**
 * Log in a user with username and password credentials.
 * @param cred Object containing username and password.
 * @returns Promise resolving to a string.
 */
export const login = (cred: { username: string, password: string }) =>
    api.post<string>('/auth/login', cred).then((res) => res.data);

/**
 * Register a new user account.
 * @param user RegisterPayload object containing user details.
 * @returns Promise resolving to a string.
 */
export const register = (user: RegisterPayload) =>
    api.post<string>('/users', user).then((res) => res.data);

/**
 * Payload for user registration.
 */
interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    ccInfo?: CcInfo;
}

/**
 * User roles available in the system.
 */
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

/**
 * Credit card information structure for registration.
 */
interface CcInfo {
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
}