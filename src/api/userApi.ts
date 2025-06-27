import api from './axios';

export interface User {
    userId: string;
    username: string;
    email: string;
    password?: string;
    role: 'USER' | 'ADMIN';
    ccInfo?: { ccNumber?: string; ccExpiry?: string; ccCvc?: string };
}

export const getUser = (id: string) =>
    api.get<User>(`/users/${id}`).then(res => res.data);

export const updateUser = (id: string, body: Partial<User>) =>
    api.put<string>(`/users/${id}`, body).then(res => res.data);

export const deactivateUser = (id: string) =>
    api.delete<string>(`/users/${id}`).then(res => res.data);