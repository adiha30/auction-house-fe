import api from './axios';

export const login = (cred: { username: string, password: string }) =>
    api.post<string>('/auth/login', cred).then((res) => res.data);

export const register = (user: RegisterPayload) =>
    api.post<string>('/users', user).then((res) => res.data);    // userId

interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    ccInfo?: CcInfo;
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

interface CcInfo {
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
}