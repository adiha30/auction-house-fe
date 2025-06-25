import {useNavigate} from 'react-router-dom';
import {useRef} from 'react';
import {Box, Card, CardContent, CardMedia, Chip, IconButton, Paper, Stack, Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {ActiveBid} from '../hooks/useBids';
import {useCountdown} from '../hooks/useCountdown';

export default function ActiveBidsSection({bids}: { bids: ActiveBid[] }) {
    const nav = useNavigate();
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
                        gap: 2,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {display: 'none'},
                        scrollbarWidth: 'none',
                        padding: '8px 0',
                    }}
                >
                    {uniqueBids.map(bid => {
                        const leading = bid.amount >= (bid.latestBidAmount ?? bid.startPrice);
                        const currentBid = bid.latestBidAmount ?? bid.startPrice;
                        const countdown = useCountdown(bid.endTime);
                        return (
                            <Card
                                key={bid.listingId}
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
                                <CardMedia
                                    component="img"
                                    sx={{height: 160, cursor: 'pointer'}}
                                    image={(bid as any).imageIds?.[0]}
                                    alt={bid.title}
                                    onClick={() => nav(`/listings/${bid.listingId}`)}
                                />
                                <CardContent
                                    onClick={() => nav(`/listings/${bid.listingId}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        pt: 1,
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                    <div>
                                        <Typography gutterBottom variant="body1" noWrap component="div"
                                                    fontWeight="bold">
                                            {bid.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Current: <b style={{color: 'black'}}>${currentBid}</b>
                                        </Typography>
                                    </div>
                                    <div>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Your bid: <b style={{color: 'black'}}>${bid.amount}</b>
                                            </Typography>
                                            <Chip size="small"
                                                  label={leading ? 'Leading' : 'Outbid'}
                                                  color={leading ? 'success' : 'error'}/>
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