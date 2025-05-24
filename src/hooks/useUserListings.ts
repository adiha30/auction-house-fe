import {useQuery} from '@tanstack/react-query'
import {getUserOpenListings, ListingDetails} from '../api/listingApi'

export const useUserListings = () => useQuery<ListingDetails[]>({
    queryKey: ['mylistings'],
    queryFn: async () => (await getUserOpenListings()),
});