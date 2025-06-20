import React, {useMemo, useState} from "react";
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
    Select,
    Tab,
    Tabs,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {getUserListings, getUserOpenListings, ListingDetails, uploadsPath,} from "../api/listingApi";
import {API_URL} from "../api/config";
import Grid from "@mui/material/Grid";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";

enum ViewMode {
    LIST = "list",
    GALLERY = "gallery",
}

enum SortField {
    TITLE = "title",
    BIDS = "bids",
    TTL = "timeToLive",
}

type SortOrder = "asc" | "desc";

type BidFilterType = "above" | "below";

const MyListingsPage: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);

    const [sortField, setSortField] = useState<SortField>(SortField.TITLE);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const [bidFilterValue, setBidFilterValue] = useState<number | "">("");
    const [bidFilterType, setBidFilterType] = useState<BidFilterType>("above");
    const [closingMethodFilter, setClosingMethodFilter] = useState<string>("all");
    const [soldFilter, setSoldFilter] = useState<string>("all");

    const navigate = useNavigate();

    const {
        data: activeListings,
        isLoading: loadingActive,
        isError: errorActive,
    } = useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "active"],
        queryFn: getUserOpenListings,
    });

    const {
        data: inactiveListings,
        isLoading: loadingInactive,
        isError: errorInactive,
    } = useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "inactive"],
        queryFn: getUserListings,
    });

    const getImageUrl = (id?: string) =>
        id?.startsWith("http") ? id : `${API_URL}${uploadsPath}/${id}`;

    const processedListings = useMemo(() => {
        const listings = tab === 0 ? activeListings : inactiveListings;
        if (!listings) return [];

        let arr = [...listings];

        arr = arr.filter(l => l && l.item && typeof l.bids === 'object');

        if (bidFilterValue !== "") {
            arr = arr.filter((l) => {
                const count = l.bids?.length ?? 0;
                return bidFilterType === "above"
                    ? count >= Number(bidFilterValue)
                    : count <= Number(bidFilterValue);
            });
        }

        if (tab === 1) {
            if (closingMethodFilter !== "all") {
                arr = arr.filter((l) => l.closingMethod === closingMethodFilter);
            }
            if (soldFilter !== "all") {
                const wantSold = soldFilter === "sold";
                arr = arr.filter((l) => (l.status === "SOLD") === wantSold);
            }
        }

        arr.sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case SortField.TITLE: {
                    const titleA = a.item?.title || "";
                    const titleB = b.item?.title || "";
                    cmp = titleA.localeCompare(titleB);
                    break;
                }
                case SortField.BIDS: {
                    const bidsA = a.bids?.length ?? 0;
                    const bidsB = b.bids?.length ?? 0;
                    cmp = bidsA - bidsB;
                    break;
                }
                case SortField.TTL: {
                    const now = Date.now();
                    const timeA = a.endTime && !isNaN(new Date(a.endTime).getTime()) ? new Date(a.endTime).getTime() - now : (sortOrder === 'asc' ? Infinity : -Infinity);
                    const timeB = b.endTime && !isNaN(new Date(b.endTime).getTime()) ? new Date(b.endTime).getTime() - now : (sortOrder === 'asc' ? Infinity : -Infinity);
                    cmp = timeA - timeB;
                    break;
                }
            }
            return sortOrder === "asc" ? cmp : -cmp;
        });
        return arr;
    }, [
        activeListings,
        inactiveListings,
        tab,
        bidFilterValue,
        bidFilterType,
        closingMethodFilter,
        soldFilter,
        sortField,
        sortOrder,
    ]);

    const handleTabChange = (_: React.SyntheticEvent, v: number) => setTab(v);
    const handleClick = (id: string) => navigate(`/listings/${id}`);

    const renderList = () => (
        <List>
            {processedListings.map((l) => {
                const img = getImageUrl(l.item.imageIds?.[0]);
                return (
                    <ListItemButton key={l.listingId} onClick={() => handleClick(l.listingId)}>
                        <ListItemAvatar>
                            <Avatar
                                variant="square"
                                src={img}
                                sx={{width: 64, height: 64, mr: 2}}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={l.item.title}
                            secondary={`Bids: ${l.bids?.length ?? 0}, Status: ${l.status}`}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );

    const renderGallery = () => (
        <Grid container spacing={2}>
            {processedListings.map((l) => {
                const img = getImageUrl(l.item.imageIds?.[0]);
                return (
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        key={l.listingId}
                        sx={{
                            flexShrink: 0,
                            flexBasis: 'calc(33.3333% - 16px)',
                            maxWidth: 'calc(33.3333% - 16px)',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Card
                            onClick={() => handleClick(l.listingId)}
                            sx={{
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                minWidth: 0,
                            }}
                        >
                            {img ? (
                                <CardMedia
                                    component="img"
                                    height={140}
                                    image={img}
                                    alt={l.item.title}
                                    sx={{objectFit: 'cover'}}
                                />
                            ) : (
                                <Box sx={{width: '100%', height: 140, backgroundColor: 'grey.200'}}/>
                            )}
                            <CardContent sx={{overflow: 'hidden', flexGrow: 1}}>
                                <Typography noWrap variant="h6">{l.item.title}</Typography>
                                <Typography noWrap variant="body2">Bids: {l.bids?.length ?? 0}</Typography>
                                {tab === 0 && (
                                    <Typography noWrap variant="body2">
                                        TTL: {
                                        l.endTime ?
                                            Math.max(0, Math.ceil((new Date(l.endTime).getTime() - Date.now()) / 60000))
                                            : 'N/A'
                                    }m
                                    </Typography>
                                )}
                                {tab === 1 && (
                                    <Typography noWrap variant="body2">Method: {l.closingMethod || 'N/A'}</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );

    const isLoading = tab === 0 ? loadingActive : loadingInactive;
    const isError = tab === 0 ? errorActive : errorInactive;

    return (
        <Box sx={{width: '100%', maxWidth: 900, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>My Listings</Typography>
            <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="Active"/>
                <Tab label="Inactive"/>
            </Tabs>
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
                {/* Sort Panel */}
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
                            <MenuItem value={SortField.BIDS}>Bids</MenuItem>
                            {tab === 0 && <MenuItem value={SortField.TTL}>Time left for listing</MenuItem>}
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

                {/* Filter Panel */}
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <FilterListIcon fontSize="small"/>
                    <FormControl size="small">
                        <InputLabel># Of Bids</InputLabel>
                        <Select
                            value={bidFilterType}
                            label="Filter Bids"
                            onChange={(e) => setBidFilterType(e.target.value as BidFilterType)}
                        >
                            <MenuItem value="above">Above</MenuItem>
                            <MenuItem value="below">Below</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        type="number"
                        label="Number"
                        value={bidFilterValue}
                        onChange={(e) => setBidFilterValue(e.target.value === '' ? '' : Number(e.target.value))}
                        sx={{width: 100}}
                    />

                    {tab === 1 && (
                        <>
                            <FormControl size="small">
                                <InputLabel id="closing-method-label">Method</InputLabel>
                                <Select
                                    labelId="closing-method-label"
                                    value={closingMethodFilter}
                                    label="Method"
                                    onChange={(e) => setClosingMethodFilter(e.target.value)}
                                    sx={{width: 100}}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="BUY_NOW">Buy Now</MenuItem>
                                    <MenuItem value="OFFER">Offer</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small">
                                <InputLabel>Sold?</InputLabel>
                                <Select
                                    value={soldFilter}
                                    label="Sold?"
                                    onChange={(e) => setSoldFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="sold">Sold</MenuItem>
                                    <MenuItem value="unsold">Unsold</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    {/* Push view toggle to right */}
                    <Box sx={{flexGrow: 1}}/>

                    {/* View Mode Toggle */}
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
                ) : isError ? (
                    <Typography color="error">Failed to load.</Typography>
                ) : processedListings.length === 0 ? (
                    <Box sx={{textAlign: 'center', mt: 4}}>
                        <Typography variant="h6" color="textSecondary">
                            Oops, looks like nothing’s here!
                        </Typography>
                        <Typography color="textSecondary">
                            Try adjusting your filters or create a new listing.
                        </Typography>
                    </Box>
                ) : viewMode === ViewMode.LIST ? (
                    renderList()
                ) : (
                    renderGallery()
                )}
            </Box>
        </Box>
    );
};

export default MyListingsPage;
