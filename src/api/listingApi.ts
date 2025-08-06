/**
 * Listing API module for managing auction listings.
 * Provides functions to fetch, create, update, and delete listings, as well as retrieve featured and user-specific listings.
 *
 * @module listingApi
 */

import api from './axios.ts'
import {Bid} from "../hooks/useBids.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";
import {User} from "./userApi.ts";

export const listingsPath = `/listings`;
export const uploadsPath = `/uploads`;

/**
 * Paginated response for listings.
 */
export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
}

/**
 * Summary information for a listing.
 */
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

/**
 * Detailed information for a listing, including bids and seller info.
 */
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

/**
 * Payload for creating a new listing.
 */
export interface CreateListingPayload {
    title: string;
    description: string;
    categoryName: string;
    buyNowPrice?: number;
    endTime: string;
    imageIds: string[];
}

/**
 * Data transfer object for an item in a listing.
 */
export interface ItemDto {
    title: string;
    description: string;
    imageIds: string[];
}

/**
 * Fetch all listings, optionally filtered by category.
 * @param category - Optional category filter.
 * @param page - Page number (default 0).
 * @param size - Page size (default 40).
 * @returns Promise resolving to an array of ListingSummary objects.
 */
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

/**
 * Fetch hot/featured listings for a category.
 * @param category - The category name.
 * @param limit - Number of listings to fetch.
 * @returns Promise resolving to an array of ListingSummary objects.
 */
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

 /**
 * Fetch a single listing by ID.
 * @param id - The listing ID.
 * @returns Promise resolving to a ListingDetails object.
 */
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

/**
 * Fetch all listings for the current user.
 * @returns Promise resolving to an array of ListingDetails objects.
 */
export const getUserListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

 /**
 * Fetch all open listings for the current user.
 * @returns Promise resolving to an array of ListingDetails objects.
 */
export const getUserOpenListings = async () =>
    await api.get<ListingDetails[]>(`${listingsPath}/user/listings/open`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

 /**
 * Fetch featured listings.
 * @param limit - Number of listings to fetch (default 5).
 * @returns Promise resolving to an array of ListingSummary objects.
 */
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

 /**
 * Search for listings by query.
 * @param query - Search query string.
 * @param sort - Sort order (default 'recent').
 * @param limit - Max results (default 40).
 * @returns Promise resolving to an array of ListingSummary objects.
 */
export const searchListings = (query: string, sort = 'recent', limit = 40) =>
    api.get<ListingSummary[]>(`${listingsPath}/search`, {params: {query, sort, limit}})
        .then(res =>
            res.data.map(listing => ({
                ...listing,
                item: {
                    ...listing.item,
                    imageIds: resolveImageUrls(listing.item.imageIds)
                },
            })));

 /**
 * Fetch listings won by the current user.
 * @param sort - Sort order (default 'recent').
 * @param page - Page number (default 0).
 * @param limit - Page size (default 10).
 * @param order - Sort direction (default 'desc').
 * @returns Promise resolving to a paginated response of ListingDetails.
 */
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
                totalPages: 1,
            };
        });

/**
 * Delete an image by its ID.
 * @param id - The image ID.
 * @returns Promise resolving when the image is deleted.
 */
export const deleteImage = async (id: string) =>
    await api.delete(`${uploadsPath}/${id}`);


/**
 * Create a new listing.
 * @param body - The listing creation payload.
 * @returns Promise resolving to the created listing data.
 */
export const createListing = (body: CreateListingPayload) =>
    api.post(listingsPath, body).then((res) => res.data);