import {useQuery} from '@tanstack/react-query'
import {getListing} from "../api/listingApi.ts";

export function useListing(id: string | undefined) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: () => getListing(id!),
        enabled: !!id,
        retry: 1
    });
}