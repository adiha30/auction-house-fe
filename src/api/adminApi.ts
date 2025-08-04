/**
 * Admin API module for managing users and listings as an admin.
 * Provides functions for deleting listings, retrieving users, searching users, and fetching seller listings.
 *
 * @module adminApi
 */
import api from "./axios.ts";
import {User} from "./userApi.ts";
import {ListingDetails} from "./listingApi.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

/**
 * Generic paginated response interface.
 * @template T Type of the content array.
 */
export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

/**
 * Delete a listing as an admin, providing a reason for deletion.
 * @param id Listing ID to delete.
 * @param reason Reason for deletion.
 * @returns Promise resolving to the API response data.
 */
export const deleteListingAsAdmin = (id: string, reason: string) =>
    api.delete(`/admin/listings/${id}`, {data: {reason}}).then(res => res.data);

/**
 * Retrieve a paginated list of users for admin view.
 * @param page Page number (default 0).
 * @param size Page size (default 10).
 * @param showInactive Whether to include inactive users (default false).
 * @returns Promise resolving to a Page of User objects.
 */
export const getUsers = (page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>(`/users/admin/all`, {params: {page, size, showInactive}}).then(res => res.data);

/**
 * Search users by query string for admin view.
 * @param query Search query string.
 * @param page Page number (default 0).
 * @param size Page size (default 10).
 * @param showInactive Whether to include inactive users (default false).
 * @returns Promise resolving to a Page of User objects.
 */
export const searchUsers = (query: string, page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>('/users/admin/search', {params: {query, page, size, showInactive}}).then(res => res.data);

/**
 * Get a paginated list of listings for a specific seller (user).
 * @param userId ID of the user (seller).
 * @param page Page number (default 0).
 * @param size Page size (default 10).
 * @returns Promise resolving to a Page of ListingDetails objects.
 */
export const getSellerListings = async (userId: string, page = 0, size = 10): Promise<Page<ListingDetails>> => {
    const {data: listings} = await api.get<ListingDetails[]>(`listings/user/${userId}/listings`, {
        params: {page, size}
    });

    const resolvedContent = listings.map(listing => ({
        ...listing,
        item: {
            ...listing.item,
            imageIds: resolveImageUrls(listing.item.imageIds)
        },
        currentPrice: listing.latestBidAmount ?? listing.startPrice
    }));

    const isLastPage = listings.length < size;
    const totalPages = isLastPage ? page + 1 : page + 2;

    return {
        content: resolvedContent,
        number: page,
        size: size,
        totalElements: -1, // Not provided by API
        totalPages: totalPages,
    };
}