import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addWatch, isWatching, removeWatch} from "../api/watchApi.ts";
import {enqueueSnackbar} from "notistack";

export function useWatch(listingId: string) {
    const queryClient = useQueryClient();
    const {data: watching} = useQuery({
        queryKey: ['watch', listingId],
        queryFn: () => isWatching(listingId),
        enabled: !!listingId,
    });

    const toggle = useMutation({
        mutationFn: () => (watching ? removeWatch(listingId) : addWatch(listingId)),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['watch', listingId]});
            const action = watching ? 'unwatched' : 'watching';
            enqueueSnackbar(`Now ${action} this listing`, {variant: 'success'});
        },
        onError: (error: AxiosError) => {
            const errorMessage = error.response?.data || 'Failed to update watch status';
            enqueueSnackbar(errorMessage, {variant: 'error'});
        },
    });

    return {watching: !!watching, toggle};
}