/**
 * Hook for fetching the current user's active bids.
 * Provides access to bids the user has placed that are still active.
 */
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getMyActiveBids} from "../api/bidApi.ts";
import {ActiveBid} from "./useBids.ts";

/**
 * Custom hook that provides functionality to fetch the current user's active bids.
 * @param {boolean} [enabled=true] - Whether the query should be enabled
 * @returns {Object} Query object with the user's active bids data and query state
 */
export const useMyActiveBids = (enabled: boolean = true) : UseQueryResult<ActiveBid[], Error> =>
    useQuery({
        queryKey: ["myActiveBids"],
        enabled: enabled,
        queryFn: () => getMyActiveBids(),
        staleTime: 30_000,
    });