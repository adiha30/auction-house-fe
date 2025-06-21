import {useQuery} from "@tanstack/react-query";
import {ListingSummary, searchListings} from "../api/listingApi.ts";

export const useSearchListings = (query: string, sort: string) =>
    useQuery<ListingSummary[]>({
        queryKey: ['search', query, sort],
        enabled: query.length >= 2,
        queryFn: () => searchListings(query, sort),
    });