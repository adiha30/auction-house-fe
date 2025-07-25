import {useQuery} from '@tanstack/react-query'
import {getUserListings, getUserOpenListings, ListingDetails} from '../api/listingApi'

export const useMyFullActiveListings = (isAdmin: boolean) =>
    useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "active"],
        queryFn: getUserOpenListings,
        enabled: !isAdmin,
    });

export const useMyFullInactiveListings = (isAdmin: boolean) =>
    useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "inactive"],
        queryFn: getUserListings,
        enabled: !isAdmin,
    });