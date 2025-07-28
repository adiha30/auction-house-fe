import api from "./axios.ts";
import {User} from "./userApi.ts";
import {ListingDetails} from "./listingApi.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const deleteListingAsAdmin = (id: string, reason: string) =>
    api.delete(`/admin/listings/${id}`, {data: {reason}}).then(res => res.data);

export const getUsers = (page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>(`/users/admin/all`, {params: {page, size, showInactive}}).then(res => res.data);

export const searchUsers = (query: string, page: number = 0, size: number = 10, showInactive: boolean = false) =>
    api.get<Page<User>>('/users/admin/search', {params: {query, page, size, showInactive}}).then(res => res.data);

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

    // The API returns a raw array, so we construct the Page object ourselves.
    // We don't have totalElements/totalPages, so we'll make an assumption for pagination.
    const isLastPage = listings.length < size;
    const totalPages = isLastPage ? page + 1 : page + 2; // Assume there's at least one more page if the current one is full

    return {
        content: resolvedContent,
        number: page,
        size: size,
        totalElements: -1, // Not provided by API
        totalPages: totalPages,
    };
}