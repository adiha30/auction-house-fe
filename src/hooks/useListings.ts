import {useQuery} from '@tanstack/react-query'
import {getAllListings} from '../api/listingApi'

export const useListings = () => useQuery({
    queryKey: ['listings'],
    queryFn: async () => (await getAllListings()).filter(listing => listing.status === 'OPEN'),
});