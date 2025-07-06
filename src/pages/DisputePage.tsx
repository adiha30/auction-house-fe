import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {useDispute} from '../hooks/useDisputes.ts';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from '@mui/material';
import {useUser} from "../hooks/useUser.ts";
import {pretty} from "./CreateListingPage.tsx";
import {useListing} from "../hooks/useListings.ts";
import {toTitleCase} from "../utils/text.ts";
import {useAuth} from '../context/AuthContext';


const DisputePage: React.FC = () => {
    const {disputeId} = useParams<{ disputeId: string }>();
    const {data: dispute, isLoading, isError} = useDispute(disputeId!);
    const {user: currentUser} = useAuth();

    const {data: listing} = useListing(dispute?.listingId, !!dispute?.listingId);
    const {data: winner} = useUser(dispute?.winnerId);
    const {data: seller} = useUser(dispute?.sellerId);

    if (isLoading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>;
    }

    if (isError || !dispute) {
        return <Typography color="error" sx={{textAlign: 'center', mt: 4}}>Failed to load dispute details.</Typography>;
    }

    const handleResolveDispute = () => {
        // Placeholder for dispute resolution logic
        console.log("Resolving dispute:", disputeId);
    };

    return (
        <Box sx={{maxWidth: 1200, mx: 'auto', mt: 4, p: 2}}>
            <Typography variant="h4" gutterBottom>Dispute Details</Typography>
            <Grid container spacing={4}>
                {/* Left Column: Listing Details */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" gutterBottom>Associated Listing</Typography>
                    <Card>
                        {listing ? (
                            <>
                                <Link to={`/listings/${listing.listingId}`}
                                      style={{textDecoration: 'none', color: 'inherit'}}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={listing.item.imageIds[0]}
                                        alt={listing.item.title}
                                        sx={{cursor: 'pointer'}}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {toTitleCase(listing.item.title)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            mb: 2
                                        }}>
                                            {listing.item.description}
                                        </Typography>
                                    </CardContent>
                                </Link>
                                <Divider/>
                                <CardContent>
                                    <Typography variant="subtitle1">Seller</Typography>
                                    <Typography
                                        color="text.secondary">{pretty(seller?.username || 'Loading...')}</Typography>
                                </CardContent>
                            </>
                        ) : (
                            <CardContent>
                                <CircularProgress/>
                            </CardContent>
                        )}
                    </Card>
                </Grid>

                {/* Right Column: Dispute Details */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" gutterBottom>Dispute Information</Typography>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>Status</Typography>
                                    <Chip label={pretty(dispute.status)} color="primary"/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>Reason</Typography>
                                    <Typography>{pretty(dispute.reason)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Details</Typography>
                                    <Typography sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                        {dispute.details || 'No details provided.'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>Winner</Typography>
                                    <Typography>{pretty(winner?.username || 'N/A')}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>Seller</Typography>
                                    <Typography>{pretty(seller?.username || 'Loading...')}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                        {currentUser?.role === 'ADMIN' && dispute.status !== 'RESOLVED' && (
                            <>
                                <Divider/>
                                <CardActions sx={{justifyContent: 'flex-end', p: 2}}>
                                    <Button variant="contained" color="primary" onClick={handleResolveDispute}>
                                        Resolve Dispute
                                    </Button>
                                </CardActions>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DisputePage;