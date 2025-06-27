import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {deactivateUser} from '../api/userApi';

export const useDeactivateUser = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deactivateUser(userId),
        onSuccess: () => {
            enqueueSnackbar('User deactivated successfully', {variant: 'success'});
            qc.invalidateQueries({queryKey: ['users']});
        },
        onError: (error) => {
            const message = (error as any)?.response?.data?.message || 'Failed to deactivate user';
            enqueueSnackbar(message, {variant: 'error'});
        },
    });
};