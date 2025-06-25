import api from './axios';
import {ListingSummary} from "./listingApi.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

export const isWatching = (id: string) =>
    api.get<boolean>(`/watch/${id}`).then(res => res.data);

export const addWatch = (id: string) =>
    api.post<void>(`/watch/${id}`);

export const removeWatch = (id: string) =>
    api.delete<void>(`/watch/${id}`);

export const getMyWatches = () =>
    api.get<ListingSummary[]>(`/watch`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

export const toggleWatch = async (id: string) => {
    const watching = await isWatching(id);
    if (watching) {
        return removeWatch(id);
    } else {
        return addWatch(id);
    }
};