import {useQuery} from '@tanstack/react-query'
import {getUserOpenListings, ListingDetails} from '../api/listingApi'
import {useAuth} from "../context/AuthContext.tsx";

export const useUserListings = () => {
    const {token} = useAuth()!;

    return useQuery<ListingDetails[]>({
        queryKey: ['mylistings'],
        queryFn: async () => (await getUserOpenListings()),
        enabled: !!token,
    })
};