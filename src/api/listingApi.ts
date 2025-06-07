import api from './axios.ts'
import {API_URL} from './config.ts';

export const listingsPath = `/listings`;
export const uploadsPath = `/uploads`;

export interface ListingSummary {
    listingId: string;
    title: string;
    startPrice: number;
    buyNowPrice?: number;
    endTime: string;
    status: 'OPEN' | 'SOLD' | 'CLOSED';
    finalPrice: number;
    latestBidAmount?: number | null;
}

export interface ListingDetails extends ListingSummary {
    item: ItemDto;
    description: string;
    imageIds: string[];
    category: string;
    seller: { userId: string; username: string };
    finalPrice: number;
}

export interface CreateListingPayload {
    title: string;
    description: string;
    categoryName: string;
    buyNowPrice?: number;
    endTime: string;
    imageIds: string[];
}

export interface ItemDto {
    title: string;
    description: string;
    imageIds: string[];
}

export const getAllListings = async () => {
    const res = await api.get<ListingSummary[]>(listingsPath);
    return res.data;
}

export const getHotListings = async (category: string, limit: number) =>
    await api.get<ListingSummary[]>(`${listingsPath}/${category}/featured`, {params: {limit}})
        .then((res) => res.data);

export const getListing = async (id: string) => {
    const res = await api.get<ListingDetails>(`${listingsPath}/${id}`);
    return {
        ...res.data,
        item: {
            ...res.data.item,
            imageIds: res.data.item.imageIds.map((imageId: string) => {
                return imageId.startsWith('http') ? imageId : `${API_URL}${uploadsPath}/${imageId}`
            })
        },
    };
};

export const getUserListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings`).then((res) => res.data);

export const getUserOpenListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings/open`).then((res) => res.data);

export const deleteImage = async (id: string) => {
    await api.delete(`${uploadsPath}/${id}`);

}

export const createListing = (body: CreateListingPayload) =>
    api.post(listingsPath, body).then((res) => res.data);
