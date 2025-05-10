import {Box, Button, Card, CardContent, CardMedia, CircularProgress, Stack, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns';
import {useListing} from '../hooks/useListing';

export default function ListingDetailsPage() {
    const {id} = useParams();
    const {data: listing, isLoading, error} = useListing(id!);

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error) {
        console.error("Error loading listing:", error);
        return (
            <Box mt={8}>
                <Typography variant="h6" color="error">Couldn't load listing</Typography>
                <Typography>{JSON.stringify(error)}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </Box>
        );
    }
    if (!listing) return <Typography mt={8}>Listing not found</Typography>;

    const timeLeft = formatDistanceToNow(new Date(listing.endTime), {addSuffix: true});

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Card sx={{maxWidth: 800, p: 2}}>
                <CardMedia component="img" height="320" image={listing.item.imageIds[0]} alt={listing.item.title}/>
                <CardContent>
                    <Typography variant="h4">{listing.item.title}</Typography>
                    <Typography color="text.secondary" gutterBottom>
                        {listing.category} · {listing.status}
                    </Typography>

                    <Typography sx={{my: 2}}>{listing.item.description}</Typography>

                    <Stack direction="row" spacing={4}>
                        <Typography><b>Start:</b> ${listing.startPrice}</Typography>
                        {listing.buyNowPrice > 0 && <Typography><b>Buy-Now:</b> ${listing.buyNowPrice}</Typography>}
                        <Typography><b>Ends:</b> {timeLeft}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
                        <Button variant="contained">Place Bid</Button>
                        <Button variant="outlined" color="success">
                            {listing.buyNowPrice > 0 ? 'Buy Now' : 'Make Buyout Offer'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}