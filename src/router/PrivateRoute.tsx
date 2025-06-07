import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

export const PrivateRoute = () => {
    const auth = useAuth();
    return auth?.token ? <Outlet/> : <Navigate to="/login" replace/>;
}