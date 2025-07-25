import {useQuery} from '@tanstack/react-query'
import {getAllListings, getListing, ListingDetails, ListingSummary} from '../api/listingApi'

export const useListings = (category?: string) =>
    useQuery<ListingSummary[]>({
        queryKey: ['listings', category ?? 'all'],
        queryFn: async () =>
            (await getAllListings(category)).filter(l => l.status === 'OPEN'),
        staleTime: 30_000,
    });

export const useListing = (id?: string, enabled = true) =>
    useQuery<ListingDetails>({
        queryKey: ['listing', id],
        queryFn: () => getListing(id!),
        enabled: !!id && enabled,
    });