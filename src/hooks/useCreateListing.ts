/**
 * Hook for creating new auction listings.
 * Provides functionality to create listings with address validation and navigation.
 */
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {createListing} from '../api/listingApi';
import {useNavigate} from 'react-router-dom';
import {useCurrentUser} from "./useCurrentUser.ts";

/**
 * Custom hook that provides functionality to create a new listing.
 * Validates user address, handles success/error states, and navigates to the new listing on success.
 * @returns {Object} A mutation object with functions to create a listing and track mutation state
 */
export const useCreateListing = () => {
    const nav = useNavigate();
    const queryClient = useQueryClient();
    const {data: user} = useCurrentUser();

    return useMutation({
        mutationFn: createListing,
        onMutate: () => {
            if (!user?.address?.street || !user?.address?.city || !user?.address?.zipCode || !user?.address?.country) {
                enqueueSnackbar('You must have a complete address to create a listing.', {variant: 'error'});
                nav('/dashboard');
                return Promise.reject(new Error('Address is missing'));
            }
        },
        onSuccess: (newId) => {
            enqueueSnackbar('Listing created successfully', {variant: 'success'});
            queryClient.invalidateQueries({queryKey: ['listings']});
            nav(`/listings/${newId}`);
        },
        onError: (error) => {
            if (error.message !== 'Address is missing') {
                enqueueSnackbar('Failed to create listing', {variant: 'error'});
            }
        },
    });
}