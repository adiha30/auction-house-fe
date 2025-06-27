import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import {useUsers} from '../hooks/useUsers';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {Delete, Edit as Pencil, Visibility as Eye} from "@mui/icons-material";

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function UserManagerPage() {
    const {data: currentUser} = useCurrentUser();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const {data, isLoading, isError} = useUsers({
        page: page - 1,
        size: rowsPerPage,
        query: debouncedSearchQuery,
        isAdmin: currentUser?.role === 'ADMIN',
    });

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
        setRowsPerPage(event.target.value as number);
        setPage(1);
    };

    const handleViewUser = (userId: string) => {
        // Navigate to user details page or open a modal
        console.log(`View user with ID: ${userId}`);
    }

    const handleEditUser = (userId: string) => {
        // Navigate to edit user page or open a modal
        console.log(`Edit user with ID: ${userId}`);
    }

    const handleDeactivateUser = (userId: string) => {
        // Call API to deactivate user
        console.log(`Deactivate user with ID: ${userId}`);
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchQuery]);

    return (
        <Paper sx={{p: 3, m: 2, display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h4" gutterBottom>User Manager</Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}>
                <TextField
                    label="Search by username or email"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{flexGrow: 1, minWidth: '300px'}}
                />
                <FormControl variant="outlined" sx={{minWidth: 120}}>
                    <InputLabel>Users per page</InputLabel>
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        label="Users per page"
                    >
                        {[5, 10, 25, 50, 100].map(size =>
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Box>

            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress/></Box>
            ) : isError ? (
                <Typography color="error" align="center" sx={{p: 4}}>Failed to load users.</Typography>
            ) : !data || data.content.length === 0 ? (
                <Typography align="center" sx={{p: 4}}>No users found.</Typography>
            ) : (
                <>
                    <List sx={{flexGrow: 1}}>
                        {data.content.map((user) => (
                            <ListItem key={user.userId} divider>
                                <ListItemAvatar>
                                    <Avatar sx={{bgcolor: 'secondary.main'}}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.email}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{mr: 1}}
                                    onClick={() => handleViewUser(user.userId)}
                                >
                                    <Eye />
                                    &nbsp;View
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{mr: 1}}
                                    onClick={() => handleEditUser(user.userId)}
                                >
                                    <Pencil />
                                    &nbsp;Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{mr: 1}}
                                    onClick={() => handleDeactivateUser(user.userId)}
                                >
                                    <Delete />
                                    &nbsp;Deactivate
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{display: 'flex', justifyContent: 'center', pt: 2}}>
                        <Pagination
                            count={data.totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            )}
        </Paper>
    );
}