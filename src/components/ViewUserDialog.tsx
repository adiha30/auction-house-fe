/**
 * ViewUserDialog component displays detailed information about a user, including their listing history.
 * Allows admins to remove listings with a specified reason.
 */
import {User} from "../api/userApi.ts";
import {ListingDetails} from "../api/listingApi.ts";
import {useSellerHistory} from "../hooks/useSellerHistory.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {enqueueSnackbar} from "notistack";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Pagination,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {deleteListingAsAdmin} from "../api/adminApi.ts";
import {useEffect, useState} from "react";
import {useBids} from "../hooks/useBids.ts";

/**
 * Props for the ViewUserDialog component.
 * @property open - Whether the dialog is open.
 * @property onClose - Callback to close the dialog.
 * @property user - The user whose details are being viewed.
 */
type ViewUserDialogProps ={
    open: boolean;
    onClose: () => void;
    user: User;
}

const reasons = [
    "Inappropriate", "Spam", "Against community guidelines",
    "Hate speech", "Harassment", "Scam", "Illegal content", "Other"
];


/**
 * Displays price information for a given listing based on its status and bids.
 *
 * @param listing - The listing details to display price info for.
 *   - If status is "OPEN", shows the current highest bid or start price.
 *   - If status is "SOLD", shows the final sale price.
 *   - If status is "REMOVED", indicates removal.
 *   - If status is "CLOSED", indicates unsold.
 *   - Otherwise, shows nothing.
 *
 * Uses the `useBids` hook to fetch bids for the listing.
 */
function ListingPriceInfo({listing}: { listing: ListingDetails }) {
    const {data: bids = []} = useBids(listing.listingId);
    const [priceInfo, setPriceInfo] = useState('');

    useEffect(() => {
        const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
        const highestBid = sortedBids[0]?.amount ?? listing.startPrice;

        switch (listing.status) {
            case "OPEN":
                setPriceInfo(`Current Price: $${highestBid}`);
                break;
            case "SOLD":
                setPriceInfo(`Sold for: $${listing.finalPrice.toLocaleString()}`);
                break;
            case "REMOVED":
                setPriceInfo(`Removed`);
                break;
            case "CLOSED":
                setPriceInfo(`Unsold`);
                break;
            default:
                setPriceInfo('');
        }
    }, [bids, listing]);

    return <>{priceInfo}</>;
}

/**
 * Displays a dialog with detailed information about a user, including their listings history.
 * Allows an admin to remove a listing with a specified reason.
 *
 * @component
 * @param {ViewUserDialogProps} props - The props for the dialog.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {() => void} props.onClose - Callback to close the dialog.
 * @param {User} props.user - The user whose details are being viewed.
 *
 * Features:
 * - Shows user details (email, role, status).
 * - Displays paginated listing history for the user.
 * - Allows removal of "OPEN" listings with a reason, using a confirmation dialog.
 * - Uses React Query for data fetching and mutation.
 * - Shows loading and error states.
 */
export default function ViewUserDialog({open, onClose, user}: ViewUserDialogProps) {
    const [page, setPage] = useState(1);
    const {data: listingsPage, isLoading, isError, error} = useSellerHistory(user?.userId, page - 1, 5);
    const queryClient = useQueryClient();

    if (isError) {
        console.error('[ViewUserDialog] Error fetching seller history:', error);
    }

    const [removingListing, setRemovingListing] = useState<ListingDetails | null>(null);
    const [reason, setReason] = useState('Inappropriate');

    const removeMutation = useMutation({
        mutationFn: ({listingId, reason}: {
            listingId: string,
            reason: string
        }) => deleteListingAsAdmin(listingId, reason),
        onSuccess: () => {
            enqueueSnackbar('Listing removed successfully', {variant: 'success'});
            queryClient.invalidateQueries({queryKey: ['sellerListings', user.userId]});
            setRemovingListing(null);
        },
        onError: (error) => {
            enqueueSnackbar(`Failed to remove listing: ${error.message}`, {variant: 'error'});
        }
    });

    const handleConfirmRemove = () => {
        if (removingListing) {
            removeMutation.mutate({listingId: removingListing.listingId, reason});
        }
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>User Details: {user.username}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1"><b>Email:</b> {user.email}</Typography>
                    <Typography variant="body1"><b>Role:</b> {user.role}</Typography>
                    <Typography variant="body1"><b>Status:</b> {user.active ? 'Active' : 'Inactive'}</Typography>

                    <Typography variant="h6" sx={{mt: 3, mb: 1}}>Listings History:</Typography>
                    {isLoading && <CircularProgress/>}
                    {isError && <Typography color="error">Failed to load listings.</Typography>}
                    {listingsPage && (
                        <Paper variant="outlined">
                            <List>
                                {listingsPage.content.length === 0 &&
                                    <ListItem><ListItemText primary="No listings found."/></ListItem>}
                                {listingsPage.content.map((listing) => (
                                    <ListItem key={listing.listingId} divider>
                                        <ListItemAvatar>
                                            <Avatar variant="square" src={listing.item.imageIds[0]}
                                                    sx={{width: 60, height: 60, mr: 2}}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={listing.item.title}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        Status: {listing.status}
                                                    </Typography>
                                                    <br/>
                                                    <ListingPriceInfo listing={listing}/>
                                                </>
                                            }
                                        />

                                        {listing.status === "OPEN" && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => setRemovingListing(listing)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                            {listingsPage.totalPages > 1 && (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                                    <Pagination
                                        count={listingsPage.totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </Paper>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!removingListing} onClose={() => setRemovingListing(null)}>
                <DialogTitle>Remove Listing?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select a reason for removing the listing "{removingListing?.item.title}". This action cannot be
                        undone.
                    </DialogContentText>
                    <TextField
                        select
                        fullWidth
                        label="Reason"
                        margin="dense"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    >
                        {reasons.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRemovingListing(null)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={removeMutation.isPending}
                        onClick={handleConfirmRemove}
                    >
                        {removeMutation.isPending ? <CircularProgress size={24}/> : 'Confirm Removal'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}