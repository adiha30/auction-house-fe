import {useQuery} from '@tanstack/react-query'
import {getUserListings, ListingDetails} from '../api/listingApi'

export const useUserListings = () => useQuery<ListingDetails[]>({
    queryKey: ['mylistings'],
    queryFn: (await getUserListings()).filter(listing => listing.status === 'OPEN'),
});