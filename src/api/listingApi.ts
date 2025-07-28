import api from './axios.ts'
import {Bid} from "../hooks/useBids.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";
import {User} from "./userApi.ts";

export const listingsPath = `/listings`;
export const uploadsPath = `/uploads`;

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

export interface ListingSummary {
    listingId: string;
    title: string;
    startPrice: number;
    buyNowPrice?: number;
    endTime: string;
    status: 'OPEN' | 'SOLD' | 'CLOSED' | 'REMOVED';
    finalPrice: number;
    seller: { userId: string; username: string };
    latestBidAmount?: number | null;
    category: string;
    item: ItemDto;
}

export interface ListingDetails extends ListingSummary {
    description: string;
    imageIds: string[];
    category: string;
    bids: Bid[];
    seller: User;
    winner?: User;
    winnerId?: string;
    finalPrice: number;
    buyNowPrice: number;
    closingMethod: 'BUY_NOW' | 'BID' | 'OFFER_ACCEPTED' | 'EXPIRED' | null;
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

export const getAllListings = async (category?: string, page = 0, size = 40) => {
    return await api.get<ListingSummary[]>(
        listingsPath,
        {params: {...(category && {category}), page, size}},
    ).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));
};

export const getHotListings = async (category: string, limit: number) =>
    await api.get<ListingSummary[]>(`${listingsPath}/${category}/featured`, {params: {limit}})
        .then(res =>
            res.data.map(listing => ({
                ...listing,
                item: {
                    ...listing.item,
                    imageIds: resolveImageUrls(listing.item.imageIds)
                },
            })));

export const getListing = async (id: string | undefined) => {
    const res = await api.get<ListingDetails>(`${listingsPath}/${id}`);
    return {
        ...res.data,
        item: {
            ...res.data.item,
            imageIds: resolveImageUrls(res.data.item.imageIds)
        },
    };
};

export const getUserListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

export const getUserOpenListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings/open`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

export const getFeaturedListings = async (limit = 5) =>
    api.get<ListingSummary[]>(`${listingsPath}/featured`, {params: {limit}})
        .then(res =>
            res.data.map(listing => ({
                ...listing,
                item: {
                    ...listing.item,
                    imageIds: resolveImageUrls(listing.item.imageIds)
                },
            })));

export const searchListings = (query: string, sort = 'recent', limit = 40) =>
    api.get<ListingSummary[]>(`${listingsPath}/search`, {params: {query, sort, limit}})
        .then(res => res.data);

export const getUserWonListings = (sort: 'recent' | 'title' = 'recent', page: number = 0, limit: number = 10, order: 'asc' | 'desc' = "desc") =>
    api.get<ListingDetails[]>(`${listingsPath}/won`, {params: {sort, page, limit, order}})
        .then((res): PaginatedResponse<ListingDetails> => {
            const listings = res.data.map(listing => ({
                ...listing,
                item: {
                    ...listing.item,
                    imageIds: resolveImageUrls(listing.item.imageIds)
                },
            }));
            return {
                content: listings,
                totalPages: 1, // Assume a single page as the API doesn't provide total.
            };
        });

export const deleteImage = async (id: string) =>
    await api.delete(`${uploadsPath}/${id}`);


export const createListing = (body: CreateListingPayload) =>
    api.post(listingsPath, body).then((res) => res.data);