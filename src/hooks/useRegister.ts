import {useMutation} from "@tanstack/react-query";
import {register} from "../api/authApi.ts";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

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