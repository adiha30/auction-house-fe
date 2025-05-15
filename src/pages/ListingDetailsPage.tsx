import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {useParams} from 'react-router-dom';
import * as Yup from 'yup';
import {formatDistanceToNow} from 'date-fns';
import {useListing} from '../hooks/useListing';
import {useAuth} from '../context/AuthContext.tsx';
import {useCategoryMetadata} from '../hooks/useCategoryMetadata.ts';
import {Field, Form, Formik} from 'formik';
import {useCreateBid} from '../hooks/useCreateBid';
import {useBids} from '../hooks/useBids.ts';

export default function ListingDetailsPage() {
    const {id} = useParams();
    const {token} = useAuth()!;
    const {data: listing, isLoading, error} = useListing(id!);
    const {data: meta} = useCategoryMetadata(listing?.category);

    const createBid = useCreateBid(id!);
    const { data: bids, isLoading: bidsLoading, error: bidsError } = useBids(id!);

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error) {
        console.error("Error loading listing:", error);
        return (
            <Box mt={8}>
                <Typography variant="h6" color="error">Couldn't load listing</Typography>
                <Typography>{JSON.stringify(error)}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </Box>
        );
    }
    if (!listing) return <Typography mt={8}>Listing not found</Typography>;

    const sortedBids = bids ? [...bids].sort((a, b) => b.amount - a.amount) : [];
    const highestBid = sortedBids.length > 0 ? sortedBids[0].amount : listing.startPrice;

    const timeLeft = formatDistanceToNow(new Date(listing.endTime), {addSuffix: true});

    const minIncrement = meta?.minBidIncrement ?? 1;

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Card sx={{maxWidth: 800, p: 2}}>
                <CardMedia component="img" height="320" image={listing.item.imageIds[0]} alt={listing.item.title}/>
                <CardContent>
                    <Typography variant="h4">{listing.item.title}</Typography>
                    <Typography color="text.secondary" gutterBottom>
                        {listing.category} · {listing.status}
                    </Typography>

                    <Typography sx={{my: 2}}>{listing.item.description}</Typography>

                    <Stack direction="row" spacing={4}>
                        <Typography><b>Highest current bid:</b> ${highestBid}</Typography>
                        {(listing.buyNowPrice ?? 0) > 0 && <Typography><b>Buy-Now:</b> ${listing.buyNowPrice}</Typography>}
                        <Typography><b>Ends:</b> {timeLeft}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
                        {listing.status === 'OPEN' && token && (
                            <Formik
                                enableReinitialize
                                initialValues={{ amount: highestBid + minIncrement }}
                                validationSchema={Yup.object({
                                    amount: Yup.number()
                                        .min(highestBid + minIncrement, `Must be at least $${highestBid + minIncrement}`)
                                        .required(),
                                })}
                                onSubmit={({amount}) =>
                                    createBid.mutate({amount, buy_now: false})
                                }
                            >
                                {({errors, touched, isValid}) => (
                                    <Form>
                                        <Stack direction="row" spacing={1} alignItems="flex-end">
                                            <Field
                                                as={TextField}
                                                name="amount"
                                                type="number"
                                                size="small"
                                                placeholder={`${highestBid + minIncrement}`}
                                                error={touched.amount && !!errors.amount}
                                                helperText={touched.amount && errors.amount}
                                            />
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                disabled={createBid.isPending || !isValid}
                                            >
                                                Bid
                                            </Button>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" sx={{mt: 0.5}}>
                                            Minimum increment: ${minIncrement}
                                        </Typography>
                                    </Form>
                                )}
                            </Formik>
                        )}

                        {(listing.buyNowPrice ?? 0) > 0 && listing.status === 'OPEN' && token && (
                            <Button
                                variant="contained"
                                color="success"
                                disabled={createBid.isPending}
                                onClick={() =>
                                    createBid.mutate({
                                        amount: listing.buyNowPrice!,
                                        buy_now: true,
                                    })
                                }
                            >
                                Buy&nbsp;Now&nbsp;${listing.buyNowPrice}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
                <Divider />
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Bidding History
                    </Typography>

                    {bidsLoading ? (
                        <CircularProgress size={24} />
                    ) : bidsError ?(
                        <Typography color="error">Failed to load bids.</Typography>
                    ) : sortedBids.length > 0 ? (
                        <Stack spacing={1}>
                            {sortedBids.map(bid => (
                                <Box key={bid.bidId} sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography>
                                        <strong>{bid.bidder.username}</strong> — ${bid.amount}{' '}
                                        <Box component="span" color="text.secondary">
                                            ({formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })})
                                        </Box>
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Typography>No bids yet. Be the first!</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
