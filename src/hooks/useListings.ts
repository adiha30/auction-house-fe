import {useQuery} from '@tanstack/react-query'
import {getAllListings, ListingSummary} from '../api/listingApi'

export const useListings = () => {
    return useQuery<ListingSummary[]>({
        queryKey: ['listings'],
        queryFn: getAllListings,
    });
}