/**
 * NavBar displays the main navigation bar for the application, with links and user actions.
 *
 * @module components/NavBar
 */

/**
 * Renders the top navigation bar with links and user actions based on authentication state.
 *
 * @returns The navigation bar component.
 */
import {AppBar, Button, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import NotificationMenu from "./NotificationMenu.tsx";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {JSX} from "react";

const hideOn = ['/login', '/register'];

/**
 * NavBar component displays the main navigation bar for the application.
 * Shows different links and actions based on authentication and user role.
 *
 * - Hides itself on `/login` and `/register` routes.
 * - Shows "Listings", "Create" (for non-admins), "Settings", notifications, and "Logout" for authenticated users.
 * - Shows "Listings", "Login", and "Register" for unauthenticated users.
 *
 * @returns {JSX.Element|null} The navigation bar component or null if hidden.
 */
export default function NavBar(): JSX.Element | null {
    const {token, setToken} = useAuth()!;
    const nav = useNavigate();
    const {pathname} = useLocation();
    const {data: user} = useCurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    if (hideOn.includes(pathname)) return null;

    const handleLogout = () => {
        setToken(null);
        nav('/login');
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{gap: 2}}>
                <Typography variant="h6" component={RouterLink} to="/"
                            sx={{flexGrow: 1, color: 'inherit', textDecoration: 'none'}}>
                    Auction House
                </Typography>

                {token && (
                    <>
                        <Button component={RouterLink} to="/listings" color="inherit">Listings</Button>
                        {!isAdmin && (
                            <Button component={RouterLink} to="/create" color="inherit">Create</Button>
                        )}
                        <Button component={RouterLink} to="/dashboard" color="inherit">Control Panel</Button>
                        <NotificationMenu/>
                        <Button onClick={handleLogout} color="inherit">Logout</Button>
                    </>
                )}

                {!token && (
                    <>
                        <Button component={RouterLink} to="/listings" color="inherit">Listings</Button>
                        <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                        <Button component={RouterLink} to="/register" color="inherit">Register</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}