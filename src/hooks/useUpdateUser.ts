import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { updateUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

export const useUpdateUser = () => {
    const { userId } = useAuth()!;
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: Record<string, unknown>) => updateUser(userId!, body),
        onSuccess: () => {
            enqueueSnackbar('Profile updated', { variant: 'success' });
            qc.invalidateQueries({ queryKey: ['currentUser', userId] });
        },
        onError: () => enqueueSnackbar('Update failed', { variant: 'error' }),
    });
};
