import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {format} from 'date-fns';
import {useNavigate} from 'react-router-dom';
import {useListings} from '../hooks/useListings';

export default function ListingsPage() {
    const { data: listings, isLoading, error } = useListings();
    const nav = useNavigate();

    if (isLoading) return <CircularProgress sx={{ mt: 8}}  />;
    if (error || !listings) return <Typography mt={8}>Couldn’t load listings.</Typography>;

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Start Price</TableCell>
                            <TableCell align="right">Buy-Now Price</TableCell>
                            <TableCell align="right">Ends At</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow
                            key={listing.listingId}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => nav(`/listings/${listing.listingId}`)}
                            >
                                <TableCell>{listing.title}</TableCell>
                                <TableCell align="right">{listing.startPrice}</TableCell>
                                <TableCell align="right">{listing.buyNowPrice}</TableCell>
                                <TableCell align="right">
                                    {format(new Date(listing.endTime), 'dd/MM/yyyy HH:mm')}
                                </TableCell>
                                <TableCell>{listing.status}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}