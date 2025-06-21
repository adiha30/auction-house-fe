import {useAuth} from "../context/AuthContext.tsx";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {useQueries, useQuery} from "@tanstack/react-query";
import {getMyWatches} from "../api/watchApi.ts";
import {useCategories} from "../hooks/useCategories.ts";
import {useUserListings} from "../hooks/useUserListings.ts";
import {getHotListings, ListingSummary} from "../api/listingApi.ts";
import {pretty} from "./CreateListingPage.tsx";
import {Box, Card, CardActionArea, CardContent, CircularProgress, Container, Typography,} from "@mui/material";
import Grid from "@mui/material/Grid";
import HeroCarousel from "../components/HeroCarousel.tsx";
import {toTitleCase} from "../utils/text.ts";
import {useMyActiveBids} from "../hooks/useMyActiveBids.ts";
import {RefObject, useRef} from "react";
import QuickAccessBar from "../components/QuickAccessBar.tsx";

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
    const { data: activeBids = [] } = useMyActiveBids(!!token);

    const bidsRef = useRef<HTMLDivElement | null>(null);
    const watchRef = useRef<HTMLDivElement | null>(null);
    const scrollTo = (ref: RefObject<HTMLDivElement | null>) =>
        ref.current?.scrollIntoView({behavior: "smooth"});

    // fire off one hot-listings query per category
    const featuredQueries = useQueries({
        queries: categories.map(category => ({
            queryKey: ["hot", category],
            queryFn: () => getHotListings(category, 4),
            enabled: !!token,
            staleTime: 60_000,
        })),
    });

    if (!token) {
        return (
            <>
                <HeroCarousel />
                <Box textAlign="center" mt={8}>
                    <Typography variant="h3">Home</Typography>
                </Box>
            </>
        );
    }

    if (userLoading || listingsLoading || watchesLoading) {
        return <CircularProgress sx={{mt: 8}}/>;
    }

    const areWatches = watches && watches.length > 0;
    const areBids = activeBids && activeBids.length > 0;

    return (
        <Container sx={{mt: 2}}>
            <HeroCarousel />

            <Box textAlign="center" mt={4}>
                <Typography variant="h4" fontWeight={600}>
                    {`Welcome back, ${toTitleCase(user?.username ?? "")}! Ready to win today?`}
                </Typography>

                <QuickAccessBar
                    onViewBids={() => scrollTo(bidsRef)}
                    areBids={areBids}
                    onWatchlist={() => scrollTo(watchRef)}
                    areWatches={areWatches}
                />
            </Box>


            {areBids && (
                <div ref={bidsRef}>
                    <Section
                        title={"My Active Bids"}
                        listings={activeBids} />
                </div>
            )}

            {userListings && userListings.length > 0 && (
                <Section title={"My Listings"} listings={userListings} />
            )}

            {areWatches && (
                <div ref={watchRef}>
                    <Section title="My Watched Listings" listings={watches}/>
                </div>
            )}

            {featuredQueries.map((q, idx) => {
                const cat = categories[idx];
                if (q.isLoading) return null;
                if (!q.data || q.data.length === 0) return null;
                return (
                    <Section
                        key={cat}
                        title={`🔥 Hot in ${pretty(cat)}`}
                        listings={q.data}
                    />
                );
            })}
        </Container>
    );
}

function Section({title, listings}: { title: string; listings: any[] }) {
    return (
        <Box mb={6}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2}>
                {listings.filter(Boolean).map(listing => (
                    <Grid item key={listing.listingId} xs={12} sm={6} md={3}>
                        <Card>
                            <CardActionArea href={`/listings/${listing.listingId}`}>
                                <CardContent>
                                    <Typography noWrap>
                                        {listing.title || listing.item?.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ${listing.startPrice} • Ends{" "}
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
