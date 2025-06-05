// src/hooks/useWatch.ts
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {addWatch, isWatching, removeWatch} from '../api/watchApi';
import {enqueueSnackbar} from 'notistack';
import {AxiosError} from 'axios';

export function useWatch(listingId: string) {
    const qc = useQueryClient();

    const {data: watching = false} = useQuery({
        queryKey: ['watch', listingId],
        queryFn: () => isWatching(listingId),
        enabled: !!listingId,
        staleTime: 30_000,
    });

    const toggle = useMutation({
        mutationFn: async () => {
            return watching ? await removeWatch(listingId) : await addWatch(listingId);
        },

        onMutate: async () => {
            await qc.cancelQueries({queryKey: ['watch', listingId]});
            const previous = qc.getQueryData<boolean>(['watch', listingId]);
            qc.setQueryData(['watch', listingId], !watching);
            return {previous};
        },

        onError: (err: AxiosError, _vars, ctx) => {
            if (ctx?.previous !== undefined) {
                qc.setQueryData(['watch', listingId], ctx.previous);
            }
            const msg =
                (err.response?.data as string) ?? 'Failed to update watch status';
            enqueueSnackbar(msg, {variant: 'error'});
        },

        onSuccess: () => {
            const text = watching ? 'unwatched' : 'watching';
            enqueueSnackbar(`Now ${text} this listing`, {variant: 'success'});
        },

        onSettled: () => {
            qc.invalidateQueries({queryKey: ['watch', listingId]});
        },
    });

    return {watching, toggle};
}
