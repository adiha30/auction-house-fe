import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    FormControl,
    InputLabel,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Pagination,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import SortIcon from "@mui/icons-material/Sort";
import {toTitleCase} from "../utils/text.ts";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {Role} from "../api/authApi.ts";
import {enqueueSnackbar} from "notistack";
import {useMyWonListings} from "../hooks/useMyWonListings.ts";
import {formatDistanceToNow} from "date-fns";
import {pretty} from "./CreateListingPage.tsx";
import {ListingDetails} from "../api/listingApi.ts";
import {DisputeReason} from "../api/disputeApi.ts";
import {useCreateDispute} from "../hooks/useDisputes.ts";
import CreateDisputeModal from "../components/CreateDisputeModal.tsx";
import DisputeButton from "../components/DisputeButton.tsx";

enum ViewMode {
    LIST = "list",
    GALLERY = "gallery",
}

enum SortField {
    TITLE = "title",
    RECENT = "recent",
}

type SortOrder = "asc" | "desc";

const ListingsWonPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    const [sortField, setSortField] = useState<SortField>(SortField.TITLE);
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [page, setPage] = useState(1);
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<ListingDetails | null>(null);
    const limit = 10;

    const navigate = useNavigate();
    const {data: user} = useCurrentUser();
    const isAdmin = user?.role === Role.ADMIN;
    const createDisputeMutation = useCreateDispute();

    useEffect(() => {
        if (isAdmin) {
            enqueueSnackbar("Admins do not have a 'Listings Won' page.", {variant: 'info'});
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const {
        data: wonListingsData,
        isLoading: isLoading,
        isError: isError,
    } = useMyWonListings(isAdmin, sortField, page - 1, limit, sortOrder);

    const wonListings = wonListingsData?.content;
    const totalPages = wonListingsData?.totalPages ?? 0;

    const handleClick = (id: string) => navigate(`/listings/${id}`);

    if (isAdmin) {
        return <Box sx={{p: 4, textAlign: 'center'}}><CircularProgress/></Box>;
    }

    const handleOpenDisputeClick = (listing: ListingDetails) => {
        setSelectedListing(listing);
        setDisputeModalOpen(true);
    };

    const handleDisputeSubmit = (reason: DisputeReason, details: string) => {
        if (selectedListing && user) {
            createDisputeMutation.mutate({
                listingId: selectedListing.listingId,
                winnerId: user.userId,
                sellerId: selectedListing.seller.userId,
                reason,
                details
            });
        }
    };

    const getListingWonDetails = (listing: ListingDetails) => (
        <>
            {`Category: `}
            <b>{`${pretty(listing.category)} `}</b>
            <br/>
            {`Won: `}
            <b>{`${formatDistanceToNow(listing.endTime)} ago`}</b>
            <br/>
            {`Bought via ${pretty(listing.closingMethod ?? "") || 'N/A'} for `}
            <b>{`$${listing.finalPrice.toLocaleString()}`}</b>
        </>
    );

    const renderList = () => (
        <List>
            {wonListings !== undefined && wonListings.map((listing) => {
                const img = listing.item.imageIds?.[0];
                const LAST_14_DAYS = 14 * 24 * 60 * 60 * 1000;
                return (
                    <ListItemButton key={listing.listingId} onClick={() => handleClick(listing.listingId)}>
                        <ListItemAvatar>
                            <Avatar
                                variant="square"
                                src={img}
                                sx={{width: 64, height: 64, mr: 2}}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={toTitleCase(listing.item.title)}
                            secondary={
                                getListingWonDetails(listing)
                            }
                        />
                        {listing.endTime && (new Date().getTime() - new Date(listing.endTime).getTime() <= LAST_14_DAYS) && (
                            <DisputeButton listing={listing} onOpenDispute={handleOpenDisputeClick}/>
                        )}
                    </ListItemButton>
                );
            })}
        </List>
    );

    const renderGallery = () => (
        <Grid container spacing={2}>
            {wonListings !== undefined && wonListings.map((listing) => {
                const img = listing.item.imageIds?.[0]
                const LAST_14_DAYS = 14 * 24 * 60 * 60 * 1000;

                return (
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        key={listing.listingId}
                        sx={{
                            flexShrink: 0,
                            flexBasis: 'calc(33.3333% - 16px)',
                            maxWidth: 'calc(33.3333% - 16px)',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Card
                            sx={{
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                minWidth: 0,
                            }}
                        >
                            <Box onClick={() => handleClick(listing.listingId)} sx={{flexGrow: 1}}>
                                {img ? (
                                    <CardMedia
                                        component="img"
                                        height={140}
                                        image={img}
                                        alt={toTitleCase(listing.item.title)}
                                        sx={{objectFit: 'cover'}}
                                    />
                                ) : (
                                    <Box sx={{width: '100%', height: 140, backgroundColor: 'grey.200'}}/>
                                )}
                                <CardContent sx={{overflow: 'hidden', flexGrow: 1}}>
                                    <Typography noWrap variant="h6">{toTitleCase(listing.item.title)}</Typography>
                                    <Typography noWrap variant="body2">
                                        {getListingWonDetails(listing)}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <CardContent sx={{pt: 0}}>
                                {listing.endTime && (new Date().getTime() - new Date(listing.endTime).getTime() <= LAST_14_DAYS) && (
                                    <DisputeButton listing={listing} onOpenDispute={handleOpenDisputeClick}/>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );

    return (
        <Box sx={{width: '100%', maxWidth: 900, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>My Won Listings</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 2,
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    alignItems: 'center',
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <SortIcon fontSize="small"/>
                    <FormControl size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as SortField)}
                            label="Sort By"
                        >
                            <MenuItem value={SortField.TITLE}>Title</MenuItem>
                            <MenuItem value={SortField.RECENT}>Bids</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel>Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            label="Order"
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, mode) => mode && setViewMode(mode)}
                        size="small"
                        aria-label="view mode"
                        sx={{borderRadius: 1}}
                    >
                        <ToggleButton value={ViewMode.LIST} aria-label="list view">
                            <ViewListIcon/>
                        </ToggleButton>
                        <ToggleButton value={ViewMode.GALLERY} aria-label="gallery view">
                            <GridViewIcon/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{mt: 2}}>
                {isLoading ? (
                    <CircularProgress/>
                ) : isError && wonListingsData === undefined ? (
                    <Typography color="error">Failed to load.</Typography>
                ) : wonListings === undefined || wonListings.length === 0 ? (
                    <Box sx={{textAlign: 'center', mt: 4}}>
                        <Typography variant="h6" color="textSecondary">
                            🫣 Oops, looks like nothing’s here! Buy something to see it here.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {viewMode === ViewMode.LIST ? renderList() : renderGallery()}
                        {totalPages > 1 && (
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                                <Pagination
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    count={totalPages}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
            {selectedListing && (
                <CreateDisputeModal
                    open={disputeModalOpen}
                    onClose={() => setDisputeModalOpen(false)}
                    listing={selectedListing}
                    onSubmit={handleDisputeSubmit}
                />
            )}
        </Box>
    );
};

export default ListingsWonPage;