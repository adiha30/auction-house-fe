import {useQuery} from "@tanstack/react-query";
import {getFeaturedListings, ListingSummary} from "../api/listingApi.ts";

export const useFeaturedListings = (limit = 5) =>
    useQuery<ListingSummary[]>({
        queryKey: ['featuredHero', limit],
        queryFn: () => getFeaturedListings(limit),
        staleTime: 60_000,
    });