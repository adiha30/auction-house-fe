import React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Typography,
} from '@mui/material';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import axios from '../api/axios';
import {enqueueSnackbar} from 'notistack';
import {pretty} from "./CreateListingPage.tsx";

export default function ProfilePage() {
    const {data: user, isLoading, error} = useCurrentUser();
    const {userId, setToken} = useAuth()!;
    const nav = useNavigate();

    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error || !user) return <Typography mt={8}>Couldn't load profile.</Typography>;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/users/${userId}`);
            enqueueSnackbar('Account deleted successfully', {variant: 'success'});
            setToken(null);
            nav('/login');
        } catch (e) {
            console.error('Delete failed', e);
            enqueueSnackbar("Couldn't delete account", {variant: 'error'});
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <Box sx={{width: '100%', maxWidth: 900, mx: 'auto', mt: 4}}>
            <Paper sx={{p: 4, width: '100%', mb: 2}}>
                <Typography variant="h5" mb={2}>
                    My Profile
                </Typography>
                <Typography><b>Username:</b> {user.username}</Typography>
                <Typography><b>Email:</b> {user.email}</Typography>
                <Typography><b>Role:</b> {pretty(user.role)}</Typography>
                {user.ccInfo?.ccNumber && (
                    <Typography>
                        <b>Card:</b> **** **** **** {user.ccInfo.ccNumber.slice(-4)}
                    </Typography>
                )}
            </Paper>

            <Box sx={{display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-start'}}>
                <Button
                    variant="contained"
                    onClick={() => nav('/dashboard/edit')}
                >
                    Edit Profile
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setConfirmOpen(true)}
                    disabled={deleting}
                >
                    {deleting ? 'Deleting…' : 'Delete Account'}
                </Button>
            </Box>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will disable your account immediately. You will be logged out and will no longer be able to
                        log in unless an admin reenables you. Proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" disabled={deleting}>
                        {deleting ? 'Deleting…' : 'Yes, delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
