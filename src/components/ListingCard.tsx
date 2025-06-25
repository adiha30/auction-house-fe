import {Box, Card, CardContent, CardMedia, IconButton, Stack, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {ListingSummary} from '../api/listingApi.ts';
import {useCountdown} from '../hooks/useCountdown.ts';
import {toTitleCase} from '../utils/text.ts';
import {isWatching, toggleWatch} from '../api/watchApi.ts';

type ListingCardProps = {
    listing: ListingSummary;
    token: string | null;
    isSeller?: boolean;
};

export default function ListingCard({listing, token, isSeller = false}: ListingCardProps) {
    const nav = useNavigate();
    const queryClient = useQueryClient();

    const {data: watching} = useQuery({
        queryKey: ['watching', listing.listingId],
        queryFn: () => isWatching(listing.listingId),
        enabled: !!token && !isSeller,
        staleTime: 60_000,
    });

    const {mutate: watchListing} = useMutation({
        mutationFn: () => toggleWatch(listing.listingId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['watching', listing.listingId]});
            queryClient.invalidateQueries({queryKey: ['myWatches']});
        },
    });

    const countdown = useCountdown(listing.endTime);
    const title = toTitleCase(listing.item?.title ?? 'Untitled Listing');
    const imageUrl = listing.item?.imageIds?.[0];

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {transform: 'scale(1.02)', boxShadow: 6},
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{position: 'relative', cursor: 'pointer'}} onClick={() => nav(`/listings/${listing.listingId}`)}>
                <CardMedia
                    component="img"
                    sx={{height: 160}}
                    image={imageUrl || `https://via.placeholder.com/300x160?text=No+Image`}
                    alt={title}
                />
                {token && !isSeller && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            watchListing();
                        }}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.7)'}
                        }}
                    >
                        {watching ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                    </IconButton>
                )}
            </Box>
            <CardContent
                onClick={() => nav(`/listings/${listing.listingId}`)}
                sx={{
                    cursor: 'pointer',
                    pt: 1,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <Typography gutterBottom variant="body1" noWrap component="div" fontWeight="bold">
                    {title}
                </Typography>
                <div>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Current:
                            <b style={{color: 'black'}}> ${listing.latestBidAmount ?? listing.startPrice}</b>
                        </Typography>
                        {listing.buyNowPrice && (
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                                Buy: ${listing.buyNowPrice}
                            </Typography>
                        )}
                    </Stack>
                    <Typography variant="body2"
                                color={countdown.isUrgent ? 'error.main' : 'text.secondary'}
                                sx={{mt: 1}}>
                        Ends in: {countdown.timeLeft}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};