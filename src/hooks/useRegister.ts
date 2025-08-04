/**
 * Hook for handling user registration functionality.
 * Provides user registration with success/error handling and navigation.
 */
import {useMutation} from "@tanstack/react-query";
import {register} from "../api/authApi.ts";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

/**
 * Custom hook that provides functionality to register a new user.
 * On successful registration, displays a success message and navigates to the login page.
 * @returns {Object} A mutation object with functions to register a user and track mutation state
 */
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            enqueueSnackbar(`User has been registered!`, {variant: 'success'});
            navigate('/login');
        },
        onError: () => {
            enqueueSnackbar('Registration failed', {variant: 'error'});
        }
    });
}