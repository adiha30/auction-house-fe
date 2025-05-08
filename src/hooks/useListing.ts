import {useQuery} from '@tanstack/react-query'
import {getListing, ListingDetails} from '../api/listingApi'

export const useListing = (id: string) => {
    return useQuery<ListingDetails>({
        queryKey: ['listings', id],
        queryFn: () => getListing(id),
        enabled: !!id,
    });
}