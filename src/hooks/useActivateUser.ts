import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {activateUser} from '../api/userApi';

export const useActivateUser = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => activateUser(userId),
        onSuccess: () => {
            enqueueSnackbar('User activated successfully', {variant: 'success'});
            qc.invalidateQueries({queryKey: ['users']});
        },
        onError: (error) => {
            const message = (error as any)?.response?.data?.message || 'Failed to activate user';
            enqueueSnackbar(message, {variant: 'error'});
        },
    });
};