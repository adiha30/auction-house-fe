/**
 * Hook for deactivating user accounts.
 * Provides functionality to deactivate a user account with success/error handling.
 */
import {useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {deactivateUser} from '../api/userApi';

/**
 * Custom hook that provides functionality to deactivate a user account.
 * @returns {Object} A mutation object with functions to deactivate a user and track mutation state
 */
export const useDeactivateUser = (): UseMutationResult<string, Error, string> => {
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