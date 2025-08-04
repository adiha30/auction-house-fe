/**
 * A route wrapper component that protects routes requiring authentication.
 * Renders child routes if user is authenticated, otherwise redirects to login.
 *
 * @returns JSX
 */
import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

export const PrivateRoute = () => {
    const auth = useAuth();
    return auth?.token ? <Outlet/> : <Navigate to="/login" replace/>;
}