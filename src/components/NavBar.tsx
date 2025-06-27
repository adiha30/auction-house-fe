import {AppBar, Button, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import NotificationMenu from "./NotificationMenu.tsx";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";

const hideOn = ['/login', '/register'];

export default function NavBar() {
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
                        <Button component={RouterLink} to="/dashboard" color="inherit">Settings</Button>
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