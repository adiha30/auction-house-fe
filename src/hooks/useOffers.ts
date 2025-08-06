/**
 * Hook for fetching offers made on a listing.
 * Provides access to all offers that have been made on a specific listing.
 */
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getOffers, OfferResponse} from "../api/offerApi";

/**
 * Custom hook that provides functionality to fetch offers for a specific listing.
 * @param {string} listingId - The ID of the listing to fetch offers for
 * @param {boolean} [enabled=true] - Whether the query should be enabled
 * @returns {Object} Query object with offers data and query state
 */
export const useOffers = (listingId: string, enabled: boolean = true): UseQueryResult<OfferResponse[], Error> =>
    useQuery<OfferResponse[]>({
        queryKey: ["offers", listingId],
        enabled,
        queryFn: () => getOffers(listingId),
        staleTime: 30_000,
    });