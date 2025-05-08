import {Box, Button, Card, CardContent, CardMedia, CircularProgress, Stack, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns';
import {useListing} from '../hooks/useListing';

export default function ListingDetailsPage() {
    const {id} = useParams();
    const {data: listing, isLoading, error} = useListing(id!);

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error || !listing) return <Typography mt={8}>Couldn't load profile.</Typography>

    const timeLeft = formatDistanceToNow(new Date(listing.endTime), {addSuffix: true});

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Card sx={{maxWidth: 800, p: 2}}>
                <CardMedia component="img" height="320" image={listing.imageUrl} alt={listing.title}/>
                <CardContent>
                    <Typography variant="h4">{listing.title}</Typography>
                    <Typography color="text.secondary" gutterBottom>
                        {listing.category} · {listing.status}
                    </Typography>

                    <Typography sx={{my: 2}}>{listing.description}</Typography>

                    <Stack direction="row" spacing={4}>
                        <Typography><b>Start:</b> ${listing.startPrice}</Typography>
                        <Typography><b>Buy-Now:</b> ${listing.buyNowPrice}</Typography>
                        <Typography><b>Ends:</b> {timeLeft}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
                        <Button variant="contained">Place Bid</Button>
                        <Button variant="outlined" color="success">Buy Now</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}