import api from './axios.ts'
import {Bid} from "../hooks/useBids.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

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
    item: ItemDto;
}

export interface ListingDetails extends ListingSummary {
    description: string;
    imageIds: string[];
    category: string;
    bids: Bid[];
    seller: { userId: string; username: string };
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

export const getAllListings = async () => {
    return await api.get<ListingSummary[]>(listingsPath).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));
}

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

export const getListing = async (id: string) => {
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

export const deleteImage = async (id: string) =>
    await api.delete(`${uploadsPath}/${id}`);


export const createListing = (body: CreateListingPayload) =>
    api.post(listingsPath, body).then((res) => res.data);
