import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {updateUser} from '../api/userApi';
import {useAuth} from '../context/AuthContext';

export const useUpdateUser = () => {
    const {userId: loggedInUserId} = useAuth()!;
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: Record<string, unknown> & { userId?: string, address?: Record<string, string> }) => {
            const idToUpdate = body.userId || loggedInUserId!;
            const isSelfUpdate = idToUpdate === loggedInUserId;

            if (isSelfUpdate && body.address) {
                const {street, city, zipCode, country} = body.address;
                if (!street || !city || !zipCode || !country) {
                    return Promise.reject(new Error('Address must be complete'));
                }
            }

            const updatePayload = {
                ...body,
                address: body.address
                    ? {
                        street: body.address.street,
                        city: body.address.city,
                        zipCode: body.address.zipCode,
                        country: body.address.country,
                    }
                    : undefined,
            };
            delete updatePayload.userId;

            return updateUser(idToUpdate, updatePayload);
        },
        onSuccess: (_data, variables) => {
            enqueueSnackbar('Profile updated', {variant: 'success'});
            const updatedUserId = variables.userId || loggedInUserId;

            qc.invalidateQueries({queryKey: ['users']});
            qc.invalidateQueries({queryKey: ['currentUser', updatedUserId]});
        },
        onError: (error) => {
            if (error instanceof Error && error.message === 'Address must be complete') {
                enqueueSnackbar('Your address must be complete.', {variant: 'error'});
            } else {
                enqueueSnackbar('Update failed', {variant: 'error'});
            }
        },
    });
};