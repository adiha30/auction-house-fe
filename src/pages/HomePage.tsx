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

    return (
        <Container sx={{mt: 2}}>
            <HeroCarousel />

            <Box textAlign="center" mt={6} mb={4}>
                <Typography variant="h4" fontWeight={600}>
                    Hello {toTitleCase(user?.username ?? '')}
                </Typography>
            </Box>


            {userListings && userListings.length > 0 && (
                <Section title="My Listings" listings={userListings}/>
            )}

            {watches && watches.length > 0 && (
                <Section title="My Watched Listings" listings={watches}/>
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
