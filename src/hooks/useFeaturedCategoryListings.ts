import {useQuery} from '@tanstack/react-query'
import {getHotListings, ListingSummary} from '../api/listingApi'

const limit = 5;

export const useFeaturedCategoryListings = (category: string) => {
    return useQuery<ListingSummary[]>({
        queryKey: ['featuredListings', category],
        queryFn: () => getHotListings(category, limit),
    });
}