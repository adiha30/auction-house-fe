import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { createListing } from '../api/listingApi';
import { useNavigate } from 'react-router-dom';

export const useCreateListing = () => {
    const nav = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createListing,
        onSuccess: (newId) => {
            enqueueSnackbar('Listing created successfully', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            nav(`/listings/${newId}`);
        },
        onError: () => {
            enqueueSnackbar('Failed to create listing', { variant: 'error' });
        },
    });
}