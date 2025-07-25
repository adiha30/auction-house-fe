import {useQuery} from "@tanstack/react-query";
import {getUserWonListings, ListingDetails, PaginatedResponse} from "../api/listingApi.ts";

export const useMyWonListings = (isAdmin: boolean, sort: 'recent' | 'title' = 'recent', page: number = 0, limit: number = 10, order: 'asc' | 'desc' = "desc") => {
    return useQuery<PaginatedResponse<ListingDetails>>({
        queryKey: ["myWonListings", sort, page, limit, order],
        queryFn: () => getUserWonListings(sort, page, limit, order),
        enabled: !isAdmin,
    });
}