import {useNavigate} from 'react-router-dom';
import {useRef} from 'react';
import {Box, Card, CardContent, CardMedia, Chip, IconButton, Stack, Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {ActiveBid} from '../hooks/useBids';
import {useCountdown} from '../hooks/useCountdown';

function BidCard({bid}: { bid: ActiveBid }) {
    const nav = useNavigate();
    const {timeLeft, isUrgent} = useCountdown(bid.endTime);
    const isWinning = bid.amount >= (bid.latestBidAmount ?? bid.startPrice);

    return (
        <Card
            sx={{width: 270, cursor: 'pointer', height: '100%'}}
            onClick={() => nav(`/listings/${bid.listingId}`)}
        >
            <CardMedia
                component="img"
                height="140"
                image={bid.imageIds[0]}
                alt={bid.title}
            />
            <CardContent>
                <Typography variant="h6" noWrap>{bid.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Your Bid: ${bid.amount.toLocaleString()}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                    <Chip
                        label={isWinning ? 'Leading' : 'Outbid'}
                        color={isWinning ? 'success' : 'error'}
                        size="small"
                    />
                    <Typography
                        variant="body2"
                        color={isUrgent ? 'error' : 'text.secondary'}
                        fontWeight={isUrgent ? 'bold' : 'normal'}
                    >
                        {timeLeft}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function ActiveBidsSection({bids}: { bids: ActiveBid[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const byListing = new Map<string, ActiveBid>();
    bids.forEach(bid => {
        const prev = byListing.get(bid.listingId);
        if (!prev || bid.amount > prev.amount) byListing.set(bid.listingId, bid);
    });
    const uniqueBids = Array.from(byListing.values());

    uniqueBids.sort((a, b) => {
        const aLeading = a.amount >= (a.latestBidAmount ?? a.startPrice);
        const bLeading = b.amount >= (b.latestBidAmount ?? b.startPrice);
        return (bLeading ? 1 : 0) - (aLeading ? 1 : 0);
    });

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const {current} = scrollRef;
            const scrollAmount = current.clientWidth;
            current.scrollBy({left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth'});
        }
    };

    const showArrows = uniqueBids.length > 4;

    return (
        <Box mb={6} mt={3}>
            <Typography variant="h5" gutterBottom>My Active Bids</Typography>
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
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {display: 'none'},
                        py: 2,
                        px: 0
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        {uniqueBids.map(bid => <BidCard key={bid.listingId} bid={bid}/>)}
                    </Stack>
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