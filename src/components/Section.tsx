import {useNavigate} from 'react-router-dom';
import {useRef} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Box, Card, CardContent, CardMedia, IconButton, Paper, Stack, Typography} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {ListingSummary} from '../api/listingApi';
import {toggleWatch} from '../api/watchApi';
import {useCountdown} from '../hooks/useCountdown';

const useWatchListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listingId: string) => toggleWatch(listingId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['myWatches']});
        },
    });
};

export default function Section({
                                    title,
                                    listings,
                                    watches,
                                    token,
                                }: {
    title: string;
    listings: ListingSummary[];
    watches?: ListingSummary[];
    token: string | null;
}) {
    const nav = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const {mutate: watchListing} = useWatchListing();
    const watchedIds = new Set(watches?.map(w => w.listingId));

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const {current} = scrollRef;
            const scrollAmount = current.clientWidth;
            current.scrollBy({left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth'});
        }
    };

    if (!listings || listings.length === 0) return null;

    const showArrows = listings.length > 4;

    return (
        <Box mb={3} mt={3}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Box sx={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                {showArrows && (
                    <IconButton
                        onClick={() => scroll('left')}
                        sx={{
                            position: 'absolute',
                            left: -16,
                            zIndex: 1,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {backgroundColor: 'white'}
                        }}
                    >
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                )}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {display: 'none'},
                        scrollbarWidth: 'none',
                        padding: '8px 0',
                        justifyContent: showArrows ? 'flex-start' : 'center'
                    }}
                >
                    {listings.filter(Boolean).map((listing) => {
                        const isWatched = watchedIds.has(listing.listingId);
                        const countdown = useCountdown(listing.endTime);
                        return (
                            <Card
                                key={listing.listingId}
                                component={Paper}
                                elevation={3}
                                sx={{
                                    width: 300,
                                    height: 280,
                                    flexShrink: 0,
                                    transition: 'transform .2s',
                                    '&:hover': {transform: 'scale(1.02)'},
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Box sx={{position: 'relative'}}>
                                    <CardMedia
                                        component="img"
                                        sx={{height: 160, cursor: 'pointer'}}
                                        image={listing.item?.imageIds?.[0] || `https://via.placeholder.com/300x160?text=No+Image`}
                                        alt={listing.title || listing.item?.title}
                                        onClick={() => nav(`/listings/${listing.listingId}`)}
                                    />
                                    {token && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                watchListing(listing.listingId);
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
                                            {isWatched ? <VisibilityOffIcon fontSize="small"/> :
                                                <VisibilityIcon fontSize="small"/>}
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
                                    }}>
                                    <Typography gutterBottom variant="body1" noWrap component="div" fontWeight="bold">
                                        {listing.title || listing.item?.title}
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
                                                    sx={{
                                                        fontVariantNumeric: 'tabular-nums',
                                                        mt: 0.5,
                                                        textAlign: 'right'
                                                    }}>
                                            {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
                {showArrows && (
                    <IconButton
                        onClick={() => scroll('right')}
                        sx={{
                            position: 'absolute',
                            right: -16,
                            zIndex: 1,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {backgroundColor: 'white'}
                        }}
                    >
                        <ArrowForwardIosIcon/>
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}