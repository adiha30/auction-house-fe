import {useQuery} from '@tanstack/react-query'
import {getAllListings, ListingSummary} from '../api/listingApi'

export const useListings = (category?: string) =>
    useQuery<ListingSummary[]>({
        queryKey: ['listings', category ?? 'all'],
        queryFn: async () =>
            (await getAllListings(category)).filter(l => l.status === 'OPEN'),
        staleTime: 30_000,
    });