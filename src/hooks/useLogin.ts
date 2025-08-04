/**
 * Hook for handling user login functionality.
 * Provides authentication and error handling for login attempts.
 */
import {useAuth} from "../context/AuthContext.tsx";
import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {login} from "../api/authApi.ts";
import {enqueueSnackbar} from "notistack";

/**
 * Custom hook that provides functionality to log users in.
 * Handles login API calls, stores the JWT token in auth context, and displays appropriate notifications.
 * @returns {Object} A mutation object with functions to login and track mutation state
 */
export const useLogin = () : UseMutationResult<string, Error, any> => {
    const auth = useAuth();
    return useMutation({
        mutationFn: login,
        onSuccess: (jwt) => {
            auth?.setToken(jwt);
            enqueueSnackbar('Welcome!', {variant: 'success'});
        },
        onError: () => enqueueSnackbar('Invalid credentials', {variant: 'error'}),
    });
};