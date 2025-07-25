import {useState} from "react";
import {useAllDisputes} from "../hooks/useAllDisputes";
import {
    Alert,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {Role} from "../api/authApi.ts";

const AllDisputesPage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {data: currentUser} = useCurrentUser();
    const {data, isLoading, isError, error} = useAllDisputes(page, rowsPerPage, currentUser?.role === Role.ADMIN);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return <CircularProgress/>;
    }

    if (isError) {
        return <Alert severity="error">{(error as Error).message}</Alert>;
    }

    const disputes = data?.content;
    const totalCount = data?.totalElements;

    return (
        <Paper sx={{p: 2}}>
            <Typography variant="h4" gutterBottom>
                All Disputes
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Dispute ID</TableCell>
                            <TableCell>Listing ID</TableCell>
                            <TableCell>Winner ID</TableCell>
                            <TableCell>Seller ID</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(disputes || []).map((dispute) => (
                            <TableRow key={dispute.disputeId}>
                                <TableCell>{dispute.disputeId}</TableCell>
                                <TableCell>{dispute.listingId}</TableCell>
                                <TableCell>{dispute.winnerId}</TableCell>
                                <TableCell>{dispute.sellerId}</TableCell>
                                <TableCell>{dispute.reason}</TableCell>
                                <TableCell>{dispute.status}</TableCell>
                                <TableCell>{new Date(dispute.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button
                                        component={RouterLink}
                                        to={`/disputes/${dispute.disputeId}`}
                                        variant="contained"
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default AllDisputesPage;