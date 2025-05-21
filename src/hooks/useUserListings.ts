import {useQuery} from '@tanstack/react-query'
import {getUserListings, ListingDetails} from '../api/listingApi'

export const useUserListings = () => {
    return useQuery<ListingDetails[]>({
        queryKey: ['mylistings'],
        queryFn: getUserListings,
    });
}