import api from "./axios.ts";
import {User} from "./userApi.ts";

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const deleteListingAsAdmin = (id: string, reason: string) =>
    api.delete(`/admin/listings/${id}`, {data: {reason}});

export const getUsers = (page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>(`/users/admin/all`, {params: {page, size, showInactive}}).then(res => res.data);

export const searchUsers = (query: string, page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>(`/users/admin/search`, {params: {query, page, size, showInactive}}).then(res => res.data);