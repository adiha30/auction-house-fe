import {Box, CircularProgress, Container, Grid, IconButton, Paper, Stack, Typography} from '@mui/material';
import {RefObject, useRef, useState} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {useAuth} from '../context/AuthContext';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useUserListings} from '../hooks/useUserListings';
import {useCategories} from '../hooks/useCategories';
import {getMyWatches} from '../api/watchApi';
import {getHotListings, ListingSummary} from '../api/listingApi';
import {useMyActiveBids} from '../hooks/useMyActiveBids';

import {pretty} from './CreateListingPage';
import HeroCarousel from '../components/HeroCarousel';
import CategoriesShowcase from '../components/CategoriesShowcase';
import QuickAccessBar from '../components/QuickAccessBar';
import {toTitleCase} from '../utils/text';
import LiveBidFeed from '../components/LiveBidFeed';
import Section from '../components/Section';
import ActiveBidsSection from "../components/ActiveBidsSection.tsx";
import {extractUserId} from "../utils/jwt.ts";

export default function HomePage() {
    const [isFeedCollapsed, setIsFeedCollapsed] = useState(true);

    /* ---------- data ---------- */
    const {token} = useAuth()!;
    const {data: user, isLoading: userLoading} = useCurrentUser();
    const {data: userListings, isLoading: listingsLoading} = useUserListings();
    const {data: categories = []} = useCategories();
    const {data: activeBids = []} = useMyActiveBids(!!token);

    const {data: watches, isLoading: watchesLoading} = useQuery<ListingSummary[]>({
        queryKey: ['myWatches'],
        queryFn: getMyWatches,
        enabled: !!token,
    });

    const bidsRef = useRef<HTMLDivElement | null>(null);
    const watchRef = useRef<HTMLDivElement | null>(null);
    const scrollTo = (ref: RefObject<HTMLDivElement | null>) =>
        ref.current?.scrollIntoView({behavior: 'smooth'});

    // one hot-listings query per category
    const featuredQueries = useQueries({
        queries: categories.map(category => ({
            queryKey: ['hot', category.name],
            queryFn: () => getHotListings(category.name, 10),
            staleTime: 60_000,
        }))
    });

    /* ---------- LOADING ---------- */
    if (userLoading || listingsLoading || watchesLoading)
        return <CircularProgress sx={{mt: 8}}/>;

    /* ---------- PAGE LAYOUT ---------- */
    return (
        <>
            <Container maxWidth={false} sx={{mt: 2, mb: 4, px: 0}}>
                <Grid container spacing={3} justifyContent="center">
                    {/* ---------- MAIN CONTENT ---------- */}
                    <Grid item xs={12}>
                        <HeroCarousel/>

                        <Box sx={{maxWidth: 1280, mx: 'auto', px: {xs: 2, md: 3}}}>
                            {/* ---------- AUTHENTICATED SECTIONS ---------- */}
                            {token && (
                                <>
                                    <Box textAlign="center" mt={4}>
                                        <Typography variant="h4" fontWeight={600}>
                                            {`Welcome back, ${toTitleCase(user?.username ?? '')}! Ready to win today?`}
                                        </Typography>

                                        <QuickAccessBar
                                            onViewBids={() => scrollTo(bidsRef)}
                                            areBids={!!activeBids.length}
                                            onWatchlist={() => scrollTo(watchRef)}
                                            areWatches={!!watches?.length}
                                        />

                                        <CategoriesShowcase/>
                                    </Box>

                                    {/* active bids */}
                                    {!!activeBids.length && (
                                        <div ref={bidsRef}>
                                            <ActiveBidsSection bids={activeBids}/>
                                        </div>
                                    )}

                                    {/* my listings */}
                                    {!!userListings?.length && (
                                        <Section title="My Listings" listings={userListings}
                                                 token={token} userId={extractUserId(token)!}/>
                                    )}

                                    {/* watchlist */}
                                    {!!watches?.length && (
                                        <div ref={watchRef}>
                                            <Section title="My Watched Listings" listings={watches}
                                                     token={token}/>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* featured per category */}
                            {featuredQueries.slice(0, 5).map((q, i) => {
                                const cat = categories[i];
                                if (q.isLoading || !q.data?.length) return null;
                                return (
                                    <Section key={cat.name} title={`🔥 Hot in ${pretty(cat.name)} ${cat.icon}`}
                                             listings={q.data} token={token}/>
                                );
                            })}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* ---------- LIVE FEED CHATBOX ---------- */}
            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    width: 360,
                    zIndex: (theme) => theme.zIndex.drawer,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out',
                    maxHeight: isFeedCollapsed ? 60 : 600, // Only header height when collapsed
                    '@keyframes pulse': {
                        '0%': {
                            transform: 'scale(0.95)',
                            boxShadow: '0 0 0 0 rgba(255, 82, 82, 0.7)',
                        },
                        '70%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 0 10px rgba(255, 82, 82, 0)',
                        },
                        '100%': {
                            transform: 'scale(0.95)',
                            boxShadow: '0 0 0 0 rgba(255, 82, 82, 0)',
                        },
                    },
                }}
            >
                <Box
                    onClick={() => setIsFeedCollapsed(!isFeedCollapsed)}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: '12px 16px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        cursor: 'pointer',
                        height: 60,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: '#ff5252',
                                animation: 'pulse 2s infinite',
                            }}
                        />
                        <Typography variant="h6" component="div">Live Feed</Typography>
                    </Stack>
                    <IconButton size="small" sx={{color: 'white'}}>
                        {isFeedCollapsed ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                    </IconButton>
                </Box>
                <Box sx={{height: 'calc(100% - 60px)', overflowY: 'auto', backgroundColor: 'background.paper'}}>
                    <LiveBidFeed/>
                </Box>
            </Paper>
        </>
    );
}