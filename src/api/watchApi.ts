import api from './axios';
import {ListingSummary} from "./listingApi.ts";

export const isWatching = (id: string) =>
    api.get<boolean>(`/watch/${id}`).then(res => res.data);

export const addWatch = (id: string) =>
    api.post<void>(`/watch/${id}`);

export const removeWatch = (id: string) =>
    api.delete<void>(`/watch/${id}`);

export const getMyWatches = () =>
    api.get<ListingSummary[]>(`/watch`).then(res => res.data);