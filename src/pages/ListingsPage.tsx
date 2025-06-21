import {useMemo, useState} from 'react';
import {
    Autocomplete,
    Box,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {format} from 'date-fns';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {useListings} from '../hooks/useListings';
import {useSearchListings} from '../hooks/useSearchListings';
import {toTitleCase} from '../utils/text';
import {ListingSummary} from '../api/listingApi';

type Listing = ListingSummary & { category?: string };

export default function ListingsPage() {
    const [params, setParams] = useSearchParams();
    const category = params.get('category') || undefined;
    const categoryParam = decodeURIComponent(params.get('category') ?? '').trim();

    const {
        data: allData,
        isLoading: isAllLoading,
        error,
    } = useListings(category);
    const all: Listing[] = useMemo(() => allData ?? [], [allData]);

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<'recent' | 'ending' | 'popular'>('recent');

    const baseFiltered = useMemo(
        () =>
            categoryParam
                ? all.filter(
                    (l) =>
                        l.category?.toLowerCase() ===
                        categoryParam.toLowerCase()
                )
                : all,
        [all, categoryParam]
    );

    const searchEnabled = query.trim().length >= 2;
    const {data: searchData = [], isFetching} = useSearchListings(
        query,
        sort
    );
    const results: Listing[] = searchData as Listing[];

    const displayed: Listing[] = searchEnabled ? results : baseFiltered;

    const nav = useNavigate();

    if (!allData && isAllLoading) return <CircularProgress sx={{mt: 8}} />;

    if (error) {
        return (
            <Typography mt={8} align="center">
                Couldn’t load listings.
            </Typography>
        );
    }

    const clearCategory = () => {
        params.delete('category');
        setParams(params, {replace: true});
    };

    return (
        <>
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={2}
                mb={3}
                mt={3}
                alignItems="center"
                justifyContent="center"
            >
                <Autocomplete
                    freeSolo
                    options={all.map((l) => l.item.title)}
                    inputValue={query}
                    loading={isFetching}
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
                >
                    <ToggleButton value="popular">Popular</ToggleButton>
                    <ToggleButton value="recent">Recently added</ToggleButton>
                    <ToggleButton value="ending">Ending soon</ToggleButton>
                </ToggleButtonGroup>

                {categoryParam && (
                    <Chip
                        label={`Category: ${toTitleCase(categoryParam)}`}
                        onDelete={clearCategory}
                        color="primary"
                        variant="outlined"
                        sx={{ml: {xs: 0, sm: 1}, mt: {xs: 1, sm: 0}}}
                    />
                )}
            </Stack>

            {displayed.length === 0 && !isFetching ? (
                <Box mt={8} textAlign="center">
                    <Typography variant="h5" gutterBottom>
                        No listings found&nbsp;🫣
                    </Typography>
                    <Typography color="text.secondary">
                        Try adjusting your search or filters.
                    </Typography>
                </Box>
            ) : (
                <Box mt={4} display="flex" justifyContent="center">
                    <TableContainer component={Paper} sx={{maxWidth: 900}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell align="right">
                                        Current price
                                    </TableCell>
                                    <TableCell align="right">
                                        Buy-Now price
                                    </TableCell>
                                    <TableCell align="right">
                                        Ends at
                                    </TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {displayed.map((listing) => (
                                    <TableRow
                                        key={listing.listingId}
                                        hover
                                        sx={{cursor: 'pointer'}}
                                        onClick={() =>
                                            nav(
                                                `/listings/${listing.listingId}`
                                            )
                                        }
                                    >
                                        <TableCell>
                                            {toTitleCase(
                                                listing.item.title
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {listing.latestBidAmount ??
                                                listing.startPrice}
                                        </TableCell>
                                        <TableCell align="right">
                                            {listing.buyNowPrice ?? '—'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {format(
                                                new Date(listing.endTime),
                                                'dd/MM/yyyy HH:mm'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {listing.status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
}
