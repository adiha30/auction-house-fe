import api from './axios';

export interface Address {
    street: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface User {
    userId: string;
    username: string;
    email: string;
    password?: string;
    role: 'USER' | 'ADMIN';
    firstName: string;
    lastName: string;
    address: Address;
    ccInfo?: { ccNumber?: string; ccExpiry?: string; ccCvc?: string };
    active: boolean;
}

export const getUser = (id: string) =>
    api.get<User>(`/users/${id}`).then(res => res.data);

export const activateUser = (id: string) =>
    api.put<string>(`/users/${id}/activate`).then(res => res.data);

export const updateUser = (id: string, body: Partial<User>) =>
    api.put<string>(`/users/${id}`, body).then(res => res.data);

export const deactivateUser = (id: string) =>
    api.delete<string>(`/users/${id}`).then(res => res.data);
