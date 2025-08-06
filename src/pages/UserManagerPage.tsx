/**
 * UserManagerPage Component
 *
 * Admin interface for managing users with comprehensive functionality:
 * - Tabular display of user accounts with pagination
 * - Search functionality with debounced queries
 * - Filter options for active/inactive users
 * - User activation/deactivation with confirmation dialogs
 * - User profile viewing and editing capabilities
 *
 * This component is only accessible to administrators and provides
 * complete user management functionality for the auction platform.
 */
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {useUsers} from "../hooks/useUsers.ts";
import {useDebounce} from "../hooks/useDebounce.ts";
import {User} from "../api/userApi.ts";
import UserActionsMenu from "../components/UserActionsMenu.tsx";
import EditUserDialog from "../components/EditUserDialog.tsx";
import {useDeactivateUser} from "../hooks/useDeactivateUser.ts";
import {useActivateUser} from "../hooks/useActivateUser.ts";
import ViewUserDialog from "../components/ViewUserDialog.tsx";

export default function UserManagerPage() {
    const {data: currentUser} = useCurrentUser();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);
    const [activatingUser, setActivatingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const {data, isLoading, isError, refetch} = useUsers({
        page: page - 1,
        size: rowsPerPage,
        query: debouncedSearchQuery,
        isAdmin: currentUser?.role === 'ADMIN',
        showInactive: showInactive,
    });

    const deactivateMutation = useDeactivateUser();
    const activateMutation = useActivateUser();

    const handlePageChange = (_event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
        setRowsPerPage(event.target.value as number);
        setPage(1);
    };

    const handleViewUser = (user: User) => {
        setViewingUser(user)
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user);
    }

    const handleDeactivateUser = (user: User) => {
        setDeactivatingUser(user);
    };

    const handleActivateUser = (user: User) => {
        setActivatingUser(user);
    };

    const handleCloseEditDialog = () => {
        setEditingUser(null);
        refetch();
    };

    const handleCloseDeactivationDialog = () => {
        setDeactivatingUser(null);
    };

    const handleCloseActivationDialog = () => {
        setActivatingUser(null);
    };

    const handleConfirmDeactivate = () => {
        if (deactivatingUser) {
            deactivateMutation.mutate(deactivatingUser.userId, {
                onSuccess: () => {
                    handleCloseDeactivationDialog();
                    refetch();
                }
            });
        }
    };

    const handleConfirmActivate = () => {
        if (activatingUser) {
            activateMutation.mutate(activatingUser.userId, {
                onSuccess: () => {
                    handleCloseActivationDialog();
                    refetch();
                }
            });
        }
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchQuery, showInactive]);

    return (
        <>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showInactive}
                                onChange={(e) => setShowInactive(e.target.checked)}
                            />
                        }
                        label="Show Inactive"
                    />
                    <FormControl variant="outlined" sx={{minWidth: 120}}>
                        <InputLabel>Users per page</InputLabel>
                        <Select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            label="Users per page"
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {isLoading && <CircularProgress sx={{alignSelf: 'center'}}/>}
                {isError && <Typography color="error">Error fetching users.</Typography>}
                {data && (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.content.map((user) => (
                                        <TableRow key={user.userId}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                                            <TableCell align="right">
                                                <UserActionsMenu
                                                    user={user}
                                                    onView={handleViewUser}
                                                    onEdit={handleEditUser}
                                                    onDeactivate={handleDeactivateUser}
                                                    onActivate={handleActivateUser}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={data.totalElements}
                            page={page - 1}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={() => {
                            }}
                            rowsPerPageOptions={[]}
                        />
                    </>
                )}
            </Paper>

            {viewingUser && (
                <ViewUserDialog
                    open={!!viewingUser}
                    onClose={() => setViewingUser(null)}
                    user={viewingUser}
                />
            )}

            {editingUser && currentUser && (
                <EditUserDialog
                    open={!!editingUser}
                    onClose={handleCloseEditDialog}
                    user={editingUser}
                    currentUser={currentUser}
                />
            )}

            <Dialog
                open={!!deactivatingUser}
                onClose={handleCloseDeactivationDialog}
            >
                <DialogTitle>Deactivate User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to deactivate user {deactivatingUser?.username}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeactivationDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDeactivate} color="error"
                            disabled={deactivateMutation.isPending}>
                        {deactivateMutation.isPending ? <CircularProgress size={24}/> : 'Deactivate'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!activatingUser}
                onClose={handleCloseActivationDialog}
            >
                <DialogTitle>Activate User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to activate user {activatingUser?.username}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseActivationDialog}>Cancel</Button>
                    <Button onClick={handleConfirmActivate} color="primary"
                            disabled={activateMutation.isPending}>
                        {activateMutation.isPending ? <CircularProgress size={24}/> : 'Activate'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}