// src/pages/HomePage.tsx
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {RefObject, useRef} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';

import {useAuth} from '../context/AuthContext';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useUserListings} from '../hooks/useUserListings';
import {useCategories} from '../hooks/useCategories';
import {getMyWatches} from '../api/watchApi';
import {getHotListings, ListingSummary} from '../api/listingApi';
import {useMyActiveBids} from '../hooks/useMyActiveBids';
import {ActiveBid} from '../hooks/useBids';

import {pretty} from './CreateListingPage';
import HeroCarousel from '../components/HeroCarousel';
import CategoriesShowcase from '../components/CategoriesShowcase';
import QuickAccessBar from '../components/QuickAccessBar';
import {toTitleCase} from '../utils/text';

export default function HomePage() {
    const {token} = useAuth()!;
    const {data: user, isLoading: userLoading} = useCurrentUser();
    const {data: userListings, isLoading: listingsLoading} = useUserListings();
    const {data: watches, isLoading: watchesLoading} = useQuery<ListingSummary[]>({
        queryKey: ['myWatches'],
        queryFn: getMyWatches,
        enabled: !!token,
    });
    const {data: categories = []} = useCategories();
    const {data: activeBids = []} = useMyActiveBids(!!token);

    const bidsRef = useRef<HTMLDivElement | null>(null);
    const watchRef = useRef<HTMLDivElement | null>(null);
    const scrollTo = (ref: RefObject<HTMLDivElement | null>) =>
        ref.current?.scrollIntoView({behavior: 'smooth'});

    // one hot-listings query per category
    const featuredQueries = useQueries({
        queries: categories.map((category) => ({
            queryKey: ['hot', category],
            queryFn: () => getHotListings(category, 4),
            enabled: !!token,
            staleTime: 60_000,
        })),
    });

    /* ---------- unauthenticated ---------- */
    if (!token) {
        return (
            <>
                <HeroCarousel/>
                <CategoriesShowcase/>
                <Box textAlign="center" mt={8}>
                    <Typography variant="h3">Home</Typography>
                </Box>
            </>
        );
    }

    /* ---------- loading ---------- */
    if (userLoading || listingsLoading || watchesLoading) {
        return <CircularProgress sx={{mt: 8}}/>;
    }

    const areWatches = !!watches?.length;
    const areBids = !!activeBids?.length;

    return (
        <Container sx={{mt: 2}}>
            <HeroCarousel/>
            <CategoriesShowcase/>

            <Box textAlign="center" mt={4}>
                <Typography variant="h4" fontWeight={600}>
                    {`Welcome back, ${toTitleCase(user?.username ?? '')}! Ready to win today?`}
                </Typography>

                <QuickAccessBar
                    onViewBids={() => scrollTo(bidsRef)}
                    areBids={areBids}
                    onWatchlist={() => scrollTo(watchRef)}
                    areWatches={areWatches}
                />
            </Box>

            {/* ---------- active bids ---------- */}
            {areBids && (
                <div ref={bidsRef}>
                    <ActiveBidsSection bids={activeBids}/>
                </div>
            )}

            {/* ---------- my listings ---------- */}
            {!!userListings?.length && <Section title="My Listings" listings={userListings}/>}

            {/* ---------- watchlist ---------- */}
            {areWatches && (
                <div ref={watchRef}>
                    <Section title="My Watched Listings" listings={watches!}/>
                </div>
            )}

            {/* ---------- featured per category ---------- */}
            {featuredQueries.map((q, idx) => {
                const cat = categories[idx];
                if (q.isLoading || !q.data?.length) return null;
                return (
                    <Section key={cat} title={`🔥 Hot in ${pretty(cat)}`} listings={q.data}/>
                );
            })}
        </Container>
    );
}


function ActiveBidsSection({ bids }: { bids: ActiveBid[] }) {
    const nav = useNavigate();

    const byListing = new Map<string, ActiveBid>();

    bids.forEach(bid => {
        const prev = byListing.get(bid.listingId);
        if (!prev || bid.amount > prev.amount) byListing.set(bid.listingId, bid);
    });

    return (
        <Box mb={6}>
            <Typography variant="h5" gutterBottom>My Active Bids</Typography>
            <Grid container spacing={2}>
                {Array.from(byListing.values()).map(bid => {
                    const leading = bid.amount === (bid.latestBidAmount ?? bid.startPrice);
                    return (
                        <Grid item key={bid.listingId} xs={12} sm={6} md={3}>
                            <Card>
                                <CardActionArea onClick={() => nav(`/listings/${bid.listingId}`)}>
                                    <CardContent>
                                        <Typography noWrap>{bid.title}</Typography>
                                        <Stack direction="row" spacing={1} mt={0.5}>
                                            <Typography variant="body2" color="text.secondary">
                                                Your bid:&nbsp;${bid.amount}
                                            </Typography>
                                            <Chip size="small"
                                                  label={leading ? 'Leading' : 'Outbid'}
                                                  color={leading ? 'success' : 'error'} />
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            Ends {new Date(bid.endTime).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}



function Section({title, listings}: { title: string; listings: any[] }) {
    const nav = useNavigate();

    return (
        <Box mb={6}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {listings
                    .filter(Boolean)
                    .map((listing) => (
                        <Grid item key={listing.listingId} xs={12} sm={6} md={3}>
                            <Card>
                                <CardActionArea onClick={() => nav(`/listings/${listing.listingId}`)}>
                                    <CardContent>
                                        <Typography noWrap>
                                            {listing.title || listing.item?.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${listing.startPrice} • Ends{' '}
                                            {new Date(listing.endTime).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}
