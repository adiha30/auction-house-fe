import {Box, Button, CircularProgress, Paper, Typography} from '@mui/material';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useNavigate} from 'react-router-dom';


export default function Dashboard() {
    const {data: user, isLoading, error} = useCurrentUser();
    const nav = useNavigate();

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error || !user) {
        return <Typography mt={8}>Couldn't load profile.</Typography>
    }

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Paper sx={{p: 4, width: 400}}>
                <Typography variant="h5" mb={2}>My Profile</Typography>
                <Typography><b>Username: </b>{user.username}</Typography>
                <Typography><b>Email: </b>{user.email}</Typography>
                <Typography><b>Role: </b>{user.role}</Typography>
                {user.ccInfo?.ccNumber && (
                    <Typography><b>Card</b> **** **** **** {user.ccInfo.ccNumber.slice(-4)}</Typography>
                )}
            </Paper>
            <Button sx={{mt: 2}} variant="outlined" onClick={() => nav('/dashboard/edit')}>
                Edit profile
            </Button>
        </Box>
);
}