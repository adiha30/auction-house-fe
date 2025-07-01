import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {updateUser} from '../api/userApi';
import {useAuth} from '../context/AuthContext';

export const useUpdateUser = () => {
    const {userId: loggedInUserId} = useAuth()!;
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: Record<string, unknown> & { userId?: string }) => {
            const idToUpdate = body.userId || loggedInUserId!;
            const updatePayload = {...body};
            delete updatePayload.userId;

            return updateUser(idToUpdate, updatePayload);
        },
        onSuccess: (_data, variables) => {
            enqueueSnackbar('Profile updated', {variant: 'success'});
            const updatedUserId = variables.userId || loggedInUserId;

            qc.invalidateQueries({queryKey: ['users']});
            qc.invalidateQueries({queryKey: ['currentUser', updatedUserId]});
        },
        onError: () => enqueueSnackbar('Update failed', {variant: 'error'}),
    });
};