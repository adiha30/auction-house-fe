import React, {useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Pagination,
    Skeleton,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import {toTitleCase} from "../utils/text.ts";
import {useCurrentUser} from "../hooks/useCurrentUser.ts";
import {formatDistanceToNow} from "date-fns";
import {Dispute} from "../api/disputeApi.ts";
import {useMyDisputes} from "../hooks/useDisputes.ts";
import {useListing} from "../hooks/useListing.ts";

enum ViewMode {
    LIST = "list",
    GALLERY = "gallery",
}

const getDisputeDetails = (dispute: Dispute, userId?: string) => {
    const isSeller = userId === dispute.sellerId;
    return (
        <>
            <Chip
                label={isSeller ? 'Seller' : 'Buyer'}
                color={isSeller ? 'info' : 'secondary'}
                size="small"
                sx={{mr: 1}}
            />
            {`Opened ${formatDistanceToNow(new Date(dispute.createdAt))} ago`}
            <br/>
            {`Status: `}
            <b>{toTitleCase(dispute.status)}</b>
        </>
    );
};

const DisputeItem: React.FC<{ dispute: Dispute; viewMode: ViewMode; userId?: string }> = ({
                                                                                              dispute,
                                                                                              viewMode,
                                                                                              userId
                                                                                          }) => {
    const navigate = useNavigate();
    const {data: listing, isLoading} = useListing(dispute.listingId);

    const handleViewDisputeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/disputes/${dispute.disputeId}`);
    };

    const handleListingClick = () => {
        navigate(`/listings/${dispute.listingId}`);
    };


    const title = listing ? toTitleCase(listing.item.title) : 'Loading...';
    const img = listing?.item.imageIds?.[0];

    if (viewMode === ViewMode.LIST) {
        return (
            <ListItemButton onClick={handleListingClick}>
                <ListItemAvatar>
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={64} height={64}/>
                    ) : (
                        <Avatar variant="square" src={img} sx={{width: 64, height: 64, mr: 2}}/>
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={getDisputeDetails(dispute, userId)}
                    secondaryTypographyProps={{component: 'div'}}
                />
                <Button variant="outlined" size="small" onClick={handleViewDisputeClick}>
                    View Dispute
                </Button>
            </ListItemButton>
        );
    }

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box onClick={handleListingClick} sx={{flexGrow: 1, cursor: 'pointer'}}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" height={140}/>
                    ) : (
                        <CardMedia
                            component="img"
                            height="140"
                            image={img || '/placeholder.png'}
                            alt={title}
                            sx={{objectFit: 'cover'}}
                        />
                    )}
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                            {getDisputeDetails(dispute, userId)}
                        </Typography>
                    </CardContent>
                </Box>
                <CardContent sx={{pt: 0}}>
                    <Button variant="outlined" size="small" fullWidth onClick={handleViewDisputeClick}>
                        View Dispute
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
};


const MyDisputesPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    const [page, setPage] = useState(1);
    const limit = 10;

    const {data: user, isLoading: isUserLoading} = useCurrentUser();
    const {
        data: disputesData,
        isLoading: isDisputesLoading,
        isError,
        error
    } = useMyDisputes(user?.userId ?? "", page - 1, limit);

    const disputes = disputesData?.content;
    const totalPages = disputesData?.totalPages ?? 0;
    const isLoading = isUserLoading || isDisputesLoading;

    const renderList = () => (
        <List>
            {disputes?.map((dispute) => (
                <DisputeItem key={dispute.disputeId} dispute={dispute} viewMode={ViewMode.LIST} userId={user?.userId}/>
            ))}
        </List>
    );

    const renderGallery = () => (
        <Grid container spacing={2}>
            {disputes?.map((dispute) => (
                <DisputeItem key={dispute.disputeId} dispute={dispute} viewMode={ViewMode.GALLERY}
                             userId={user?.userId}/>
            ))}
        </Grid>
    );

    return (
        <Box sx={{width: '100%', maxWidth: 900, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>My Disputes</Typography>
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, ml: 'auto'}}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, mode) => mode && setViewMode(mode)}
                        size="small"
                        aria-label="view mode"
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
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>
                ) : isError ? (
                    <Typography color="error" sx={{textAlign: 'center', mt: 4}}>
                        Failed to load disputes: {error?.message}
                    </Typography>
                ) : !disputes || disputes.length === 0 ? (
                    <Box sx={{textAlign: 'center', mt: 4}}>
                        <Typography variant="h6" color="textSecondary">
                            You have no disputes.
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
        </Box>
    );
};

export default MyDisputesPage;