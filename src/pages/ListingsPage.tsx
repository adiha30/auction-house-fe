/**
 * ListingsPage Component
 *
 * Displays all auction listings with advanced filtering and navigation features:
 * - Category filtering with a horizontally scrollable category selector
 * - Search functionality with autocomplete
 * - Sort options (recent, ending, popular)
 * - Infinite scrolling for pagination
 * - Responsive grid layout for listing cards
 *
 * The component maintains search parameters in URL for shareable filtered views
 * and optimizes performance with pagination and lazy loading.
 */
import {useEffect, useMemo, useRef, useState} from 'react';
import {
    Autocomplete,
    Avatar,
    Box,
    ButtonBase,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {useSearchParams} from 'react-router-dom';
import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';

import {useSearchListings} from '../hooks/useSearchListings';
import {toTitleCase} from '../utils/text';
import {getAllListings, ListingSummary} from '../api/listingApi';
import {useCategories} from "../hooks/useCategories.ts";
import ListingCard from '../components/ListingCard.tsx';
import {useAuth} from "../context/AuthContext.tsx";
import {extractUserId} from "../utils/jwt.ts";

type Listing = ListingSummary & { category?: string };


export default function ListingsPage() {
    const [params, setParams] = useSearchParams();
    const categoryParam = decodeURIComponent(params.get('category') ?? '').trim();
    const category = categoryParam || undefined;

    const {token} = useAuth()!;
    const {data: categories = []} = useCategories();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery<ListingSummary[], Error, InfiniteData<ListingSummary[]>, (string | undefined)[], number>({
        queryKey: ['listings', category],
        queryFn: ({pageParam}) => getAllListings(category, pageParam, pageParam === 0 ? 40 : 20),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) {
                return undefined;
            }
            return allPages.length;
        },
    });

    const listingsForCategory = useMemo(() => data?.pages.flatMap(page => page) ?? [], [data]);
    const autocompleteOptions = useMemo(() => (listingsForCategory ?? []).map((l) => l.item.title), [listingsForCategory]);
    const allCategories = useMemo(() => [{name: 'All', icon: '🌐'}, ...categories], [categories]);

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<'recent' | 'ending' | 'popular'>('recent');

    const searchEnabled = query.trim().length >= 2;
    const {data: searchData = [], isFetching: isSearchFetching} = useSearchListings(
        query,
        sort
    );

    const searchResults = useMemo(() => {
        if (!category) return searchData as Listing[];
        return (searchData as Listing[]).filter(
            l => l.category?.toLowerCase() === category.toLowerCase()
        );
    }, [searchData, category]);

    const displayed: Listing[] = searchEnabled ? searchResults : (listingsForCategory ?? []);

    const {ref, inView} = useInView();
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && !isLoadingMore) {
            setIsLoadingMore(true);
            const fetchPromise = fetchNextPage();
            const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

            Promise.all([fetchPromise, delayPromise]).finally(() => {
                setIsLoadingMore(false);
            });
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isLoadingMore]);

    const handleCategorySelect = (categoryName: string) => {
        const newParams = new URLSearchParams(params);
        if (categoryName === 'All') {
            newParams.delete('category');
        } else {
            newParams.set('category', encodeURIComponent(categoryName));
        }
        setParams(newParams, {replace: true});
    };

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
        if (isDragging && scrollContainerRef.current) {
            setIsDragging(false);
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseUp = () => {
        if (isDragging && scrollContainerRef.current) {
            setIsDragging(false);
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };


    if (status === 'pending') return <CircularProgress sx={{mt: 8}}/>;

    if (status === 'error') {
        return (
            <Typography mt={8} align="center">
                Couldn’t load listings. {(error as Error)?.message}
            </Typography>
        );
    }

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            <Box sx={{my: 4, display: 'flex', justifyContent: 'center'}}>
                <Paper
                    elevation={2}
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        maxWidth: '100%',
                        overflowX: 'auto',
                        cursor: 'grab',
                        userSelect: 'none',
                        '&::-webkit-scrollbar': {display: 'none'},
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                >
                    <Stack direction="row" spacing={{xs: 2, sm: 4}} justifyContent="flex-start" flexWrap="nowrap">
                        {allCategories.map(cat => (
                            <Stack key={cat.name} alignItems="center" spacing={0.5}>
                                <ButtonBase
                                    onClick={() => handleCategorySelect(cat.name)}
                                    sx={{borderRadius: '50%', p: 0.5}}
                                >
                                    <Avatar
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            fontSize: '2.5rem',
                                            bgcolor: categoryParam.toLowerCase() === cat.name.toLowerCase() || (cat.name === 'All' && !categoryParam)
                                                ? 'primary.main'
                                                : 'grey.300',
                                            color: categoryParam.toLowerCase() === cat.name.toLowerCase() || (cat.name === 'All' && !categoryParam)
                                                ? 'primary.contrastText'
                                                : 'text.primary',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {cat.icon}
                                    </Avatar>
                                </ButtonBase>
                                <Typography variant="caption" fontWeight={600} noWrap>
                                    {toTitleCase(cat.name.replace('_', ' '))}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
            </Box>

            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={2}
                mb={3}
                alignItems="center"
                justifyContent="center"
            >
                <Autocomplete
                    freeSolo
                    options={autocompleteOptions}
                    inputValue={query}
                    loading={isSearchFetching}
                    onInputChange={(_e, v) => {
                        setQuery(v);
                        if (v.trim().length < 2) setSort('recent');
                    }}
                    sx={{flex: '1 1 300px', maxWidth: 400}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search listings…"
                            size="small"
                            autoComplete="off"
                        />
                    )}
                />

                <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={sort}
                    onChange={(_e, v) => v && setSort(v)}
                    disabled={!searchEnabled}
                >
                    <ToggleButton value="popular">Popular</ToggleButton>
                    <ToggleButton value="recent">Recently added</ToggleButton>
                    <ToggleButton value="ending">Ending soon</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {displayed.length === 0 && !isSearchFetching ? (
                <Box mt={8} textAlign="center">
                    <Typography variant="h5" gutterBottom>
                        No listings found&nbsp;🫣
                    </Typography>
                    <Typography color="text.secondary">
                        Try adjusting your search or filters.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="h4" component="h2" gutterBottom>
                        {categoryParam ? `${toTitleCase(categoryParam)} Listings` : 'All Listings'}
                    </Typography>
                    <Grid container spacing={3}>
                        {displayed.map((listing) => (
                            <Grid item key={listing.listingId} xs={12} sm={6} md={4} lg={3}>
                                <ListingCard listing={listing} token={token} isSeller={(() => {
                                    if (!token) return false;
                                    try {
                                        return listing.seller.userId === extractUserId(token);
                                    } catch {
                                        return false;
                                    }
                                })()}/>
                            </Grid>
                        ))}
                    </Grid>
                    {!searchEnabled && hasNextPage && (
                        <div ref={ref} style={{height: '1px', marginTop: '2rem'}}/>
                    )}
                    {isLoadingMore && (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, my: 4}}>
                            <CircularProgress size={24}/>
                            <Typography>Loading more...</Typography>
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
}