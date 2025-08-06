/**
 * Hook for activating a user account.
 * Provides functionality to activate a deactivated user account with success/error handling.
 */
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {activateUser} from '../api/userApi';

/**
 * Custom hook that provides functionality to activate a user account.
 * @returns {Object} A mutation object with functions to activate a user and track mutation state
 */
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