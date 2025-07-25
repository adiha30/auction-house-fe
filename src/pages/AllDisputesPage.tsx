import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    TablePagination,
    Typography,
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {Role} from "../api/authApi.ts";
import {useState} from "react";
import {useAllDisputes} from "../hooks/useAllDisputes.ts";
import {useUser} from "../hooks/useUser.ts";
import {useListing} from "../hooks/useListing.ts";
import {GridView, ViewList} from "@mui/icons-material";
import {Dispute} from "../api/disputeApi.ts";

const DisputeCard = ({dispute}: { dispute: Dispute }) => {
    const {data: winner, isLoading: isWinnerLoading} = useUser(dispute.winnerId);
    const {data: seller, isLoading: isSellerLoading} = useUser(dispute.sellerId);
    const {data: listing, isLoading: isListingLoading} = useListing(dispute.listingId);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {isListingLoading ? "Loading..." : listing?.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Winner: {isWinnerLoading ? "Loading..." : winner?.username}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Seller: {isSellerLoading ? "Loading..." : seller?.username}
                </Typography>
                <Typography variant="body2" component="p">
                    Reason: {dispute.reason}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Status: {dispute.status}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Opened: {new Date(dispute.createdAt).toLocaleDateString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    component={RouterLink}
                    to={`/disputes/${dispute.disputeId}`}
                    variant="contained"
                    size="small"
                >
                    View Dispute
                </Button>
            </CardActions>
        </Card>
    );
}

const AllDisputesPage = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [view, setView] = useState('gallery'); // 'gallery' or 'list'
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
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h4" gutterBottom>
                    All Disputes
                </Typography>
                <Box>
                    <IconButton onClick={() => setView('list')} color={view === 'list' ? 'primary' : 'default'}>
                        <ViewList/>
                    </IconButton>
                    <IconButton onClick={() => setView('gallery')} color={view === 'gallery' ? 'primary' : 'default'}>
                        <GridView/>
                    </IconButton>
                </Box>
            </Box>
            <Grid container spacing={2} direction={view === 'list' ? 'column' : 'row'}>
                {(disputes || []).map((dispute) => (
                    <Grid item key={dispute.disputeId} xs={12} sm={view === 'gallery' ? 6 : 12}
                          md={view === 'gallery' ? 4 : 12}>
                        <DisputeCard dispute={dispute}/>
                    </Grid>
                ))}
            </Grid>
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