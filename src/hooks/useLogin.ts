import {useAuth} from "../context/AuthContext.tsx";
import {useMutation} from "@tanstack/react-query";
import {login} from "../api/authApi.ts";
import {enqueueSnackbar} from "notistack";

export const useLogin = () => {
    const auth = useAuth();
    return useMutation({
        mutationFn: login,
        onSuccess: (jwt) => {
            auth?.setToken(jwt);
            enqueueSnackbar('Welcome!', { variant: 'success' });
        },
        onError: () => enqueueSnackbar('Invalid credentials', { variant: 'error' }),
    });
};