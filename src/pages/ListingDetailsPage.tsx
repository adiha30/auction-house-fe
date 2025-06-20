import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {formatDistanceToNow} from 'date-fns';
import {useParams} from 'react-router-dom';
import {isAxiosError} from 'axios';
import {useQueryClient} from '@tanstack/react-query';

import {useListing} from '../hooks/useListing';
import type {Bid} from '../hooks/useBids'
import {useBids} from '../hooks/useBids';
import {useOffers} from '../hooks/useOffers';
import {useWatch} from '../hooks/useWatch';
import {useCreateBid} from '../hooks/useCreateBid';
import {useCreateOffer} from '../hooks/useCreateOffer';
import {useAcceptOffer} from '../hooks/useAcceptOffer';
import {useRejectOffer} from '../hooks/useRejectOffer';
import {useCategoryMetadata} from '../hooks/useCategoryMetadata';
import {useAuth} from '../context/AuthContext';

import {OfferRow} from '../components/OfferRow';
import {useWithdrawOffer} from "../hooks/useWithdrawOffer";
import {toTitleCase} from "../utils/text.ts";
import {useBuyNowConfirm} from "../hooks/useBuyNowConfirm.tsx";

export default function ListingDetailsPage() {
    const qc = useQueryClient();
    const {id} = useParams<{ id: string }>();
    const {token, userId} = useAuth()!;

    const {data: listing, isLoading, error} = useListing(id!);
    const {data: meta} = useCategoryMetadata(listing?.category);
    const {data: bids = [], isLoading: bidsLoading, error: bidsError} =
        useBids(id!);

    const isSeller = listing?.seller.userId === userId;
    const wantOffers = isSeller || !!userId;
    const {data: offers = [], isLoading: offersLoading} =
        useOffers(id!, wantOffers);

    const createBid = useCreateBid(id!);
    const createOffer = useCreateOffer(id!);
    const acceptOffer = useAcceptOffer(id!);
    const rejectOffer = useRejectOffer(id!);
    const withdrawOffer = useWithdrawOffer(id!);

    const {watching, toggle} = useWatch(id!);

    if (isLoading) return <CircularProgress sx={{mt: 8}}/>;
    if (error) {
        const msg = isAxiosError(error)
            ? (error.response?.data as { cause?: string; message?: string })?.cause ??
            (error.response?.data as { cause?: string; message?: string })?.message ??
            error.message
            : 'Please check your connection and try again.';
        return (
            <ErrorBlock message={msg} onRetry={() => {
                qc.invalidateQueries({queryKey: ['listing', id]});
                window.location.reload();
            }}/>
        );
    }
    if (!listing) return <Typography mt={8}>Listing not found</Typography>;

    const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
    const highestBid = sortedBids[0]?.amount ?? listing.startPrice;
    const minIncrement = meta?.minBidIncrement ?? 1;
    const hasBuyNow = (listing.buyNowPrice ?? 0) > 0;
    const offersAllowed = !hasBuyNow;
    const timeLeft = formatDistanceToNow(new Date(listing.endTime), {addSuffix: true});

    const acceptedOffer = offers.find(o => o.status === 'ACCEPTED');
    const closedWithOffer =
        listing.closingMethod === 'OFFER_ACCEPTED' || !!acceptedOffer;
    const closedWithBuyNow = listing.closingMethod === 'BUY_NOW';

    let resultLabel = 'Highest current bid:';
    let resultAmount = highestBid;

    if (listing.status !== 'OPEN') {
        if (closedWithOffer) {
            resultLabel = 'Chosen offer:';
            resultAmount = acceptedOffer?.amount ?? listing.finalPrice ?? highestBid;
        } else if (closedWithBuyNow) {
            resultLabel = 'Buy-Now price:';
            resultAmount = listing.finalPrice ?? listing.buyNowPrice ?? highestBid;
        } else {
            resultLabel = 'Winning bid:';
            resultAmount = listing.finalPrice ?? highestBid;
        }
    }

    const myOffers = offers.filter(o => o.offerorId === userId);

    return (
        <Box mt={4} display="flex" justifyContent="center">
            <Card sx={{maxWidth: 800, p: 2}}>
                <CardMedia
                    component="img"
                    height="320"
                    image={listing.item.imageIds[0]}
                    alt={toTitleCase(listing.item.title)}
                />

                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1}}>
                        <Typography variant="h4">{toTitleCase(listing.item.title)}</Typography>
                        <IconButton
                            size="small"
                            onClick={() => toggle.mutate()}
                            disabled={toggle.isPending}
                            title={watching ? 'Unwatch' : 'Watch'}
                        >
                            {watching ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                        </IconButton>
                    </Stack>

                    <Typography color="text.secondary" gutterBottom>
                        {listing.category} · {listing.status}
                    </Typography>

                    <Typography sx={{my: 2}}>{listing.item.description}</Typography>

                    <Stack direction="row" spacing={4}>
                        <Typography>
                            <b>{resultLabel}</b> ${resultAmount}
                        </Typography>
                        {hasBuyNow && (
                            <Typography>
                                <b>Buy-Now:</b> ${listing.buyNowPrice}
                            </Typography>
                        )}
                        <Typography>
                            <b>Ends:</b> {timeLeft}
                        </Typography>
                    </Stack>

                    {listing.status === 'OPEN' && token && (
                        <BidForm
                            highestBid={highestBid}
                            minIncrement={minIncrement}
                            buyNowPrice={listing.buyNowPrice}
                            createBid={createBid}
                        />
                    )}

                    {offersAllowed && (
                        <>
                            <Divider sx={{my: 3}}/>

                            {listing.status === 'OPEN' && token && !isSeller && (
                                <OfferForm
                                    initialAmount={highestBid + 1}
                                    createOffer={createOffer}
                                />
                            )}

                            {isSeller && (
                                <OfferList
                                    title="Offers"
                                    offers={offers}
                                    loading={offersLoading}
                                    isSeller
                                    onAccept={acceptOffer.mutate}
                                    onReject={rejectOffer.mutate}
                                    userId={userId}
                                    busy={acceptOffer.isPending || rejectOffer.isPending || withdrawOffer.isPending}
                                />
                            )}

                            {!isSeller && myOffers.length > 0 && (
                                <OfferList
                                    title="My Offers"
                                    offers={myOffers}
                                    showUsername={false}
                                    loading={offersLoading}
                                    userId={userId ?? undefined}
                                    onWithdraw={withdrawOffer.mutate}
                                    isSeller={false}
                                />
                            )}
                        </>
                    )}
                </CardContent>

                <Divider/>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                        Bidding History
                    </Typography>

                    {bidsLoading ? (
                        <CircularProgress size={24}/>
                    ) : bidsError ? (
                        <Typography color="error">Failed to load bids.</Typography>
                    ) : sortedBids.length ? (
                        <Stack spacing={1}>
                            {sortedBids.map(bid => (
                                <BidRow key={bid.bidId} bid={bid}/>
                            ))}
                        </Stack>
                    ) : (
                        <Typography>No bids yet</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

function ErrorBlock({message, onRetry}: { message: string; onRetry: () => void }) {
    return (
        <Box mt={8} textAlign="center">
            <Typography variant="h6" color="error">
                Couldn't load listing
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
            <Button variant="outlined" onClick={onRetry}>
                Try Again
            </Button>
        </Box>
    );
}

function BidForm({
                     highestBid,
                     minIncrement,
                     buyNowPrice,
                     createBid,
                 }: {
    highestBid: number;
    minIncrement: number;
    buyNowPrice?: number;
    createBid: ReturnType<typeof useCreateBid>;
}) {
    const {ask, dialog} = useBuyNowConfirm();

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    amount: buyNowPrice
                        ? Math.min(highestBid + minIncrement, buyNowPrice)
                        : highestBid + minIncrement,
                }}
                validationSchema={Yup.object({
                    amount: Yup.number()
                        .required()
                        .test('min-or-buy-now', `Must be at least $${highestBid + minIncrement}`, value =>
                            value === buyNowPrice || (value ?? 0) >= highestBid + minIncrement
                        ),
                })}
                onSubmit={({amount}) => createBid.mutate({amount, buy_now: false})}
            >
                {({errors, touched, isValid}) => (
                    <Form>
                        <Stack direction="row" spacing={1} alignItems="flex-end" sx={{mt: 3}}>
                            <Field
                                as={TextField}
                                name="amount"
                                type="number"
                                size="small"
                                placeholder={`${highestBid + minIncrement}`}
                                error={touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                            />
                            <Button variant="contained" type="submit" disabled={createBid.isPending || !isValid}>
                                Bid
                            </Button>
                            {buyNowPrice && buyNowPrice > 0 && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => ask(
                                        () => createBid.mutate({amount: buyNowPrice, buy_now: true}),
                                        `$${buyNowPrice}`
                                    )}
                                    disabled={createBid.isPending}
                                >
                                    Buy Now
                                </Button>
                            )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{mt: 0.5}}>
                            Minimum increment: ${minIncrement}
                        </Typography>
                    </Form>
                )}
            </Formik>
            {dialog}
        </>
    );
}

function OfferForm({
                       initialAmount,
                       createOffer,
                   }: {
    initialAmount: number;
    createOffer: ReturnType<typeof useCreateOffer>;
}) {
    return (
        <Formik
            initialValues={{amount: initialAmount}}
            validationSchema={Yup.object({amount: Yup.number().min(1).required()})}
            onSubmit={({amount}, {resetForm}) =>
                createOffer.mutate(amount, {onSuccess: () => resetForm()})
            }
        >
            {({errors, touched, isSubmitting}) => (
                <Form>
                    <Stack direction="row" spacing={1} alignItems="flex-end" sx={{mb: 2}}>
                        <Field
                            as={TextField}
                            name="amount"
                            type="number"
                            label="Your offer ($)"
                            size="small"
                            error={touched.amount && !!errors.amount}
                            helperText={touched.amount && errors.amount}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={<LocalOfferIcon/>}
                            disabled={isSubmitting}
                        >
                            Send Offer
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
}

function OfferList({
                       title,
                       offers,
                       showUsername = true,
                       loading,
                       isSeller,
                       onAccept,
                       onReject,
                       onWithdraw: onWithdraw,
                       userId,
                       busy,
                   }: {
    title: string;
    offers: Parameters<typeof OfferRow>[0]['offer'][];
    showUsername?: boolean;
    loading: boolean;
    isSeller: boolean;
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onWithdraw?: (id: string) => void;
    userId?: string;
    busy?: boolean;
}) {
    if (loading)
        return (
            <>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <CircularProgress size={24}/>
            </>
        );

    if (!offers.length)
        return (
            <>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography>No offers yet.</Typography>
            </>
        );

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Stack spacing={1}>
                {offers.map(offer => (
                    <OfferRow
                        key={offer.offerId}
                        offer={offer}
                        showUsername={showUsername}
                        isSeller={isSeller}
                        isMine={offer.offerorId === userId}
                        onAccept={() => onAccept?.(offer.offerId)}
                        onReject={() => onReject?.(offer.offerId)}
                        onWithdraw={() => onWithdraw?.(offer.offerId)}
                        disabled={busy}
                    />
                ))}
            </Stack>
        </>
    );
}

function BidRow({bid}: { bid: Bid }) {
    return (
        <Box sx={{borderBottom: '1px solid #eee', pb: 1}}>
            <Typography>
                <strong>{bid.bidder.username}</strong> — ${bid.amount}{' '}
                <Box component="span" color="text.secondary">
                    ({formatDistanceToNow(new Date(bid.createdAt), {addSuffix: true})})
                </Box>
            </Typography>
        </Box>
    );
}
