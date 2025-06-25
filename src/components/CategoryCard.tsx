import {useFeaturedCategoryListings} from "../hooks/useFeaturedCategoryListings.ts";
import {CircularProgress, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {pretty} from "../pages/CreateListingPage.tsx";
import {ReactNode} from "react";

export default function CategoryCard({name, icon, onClick}: { name: string; icon: ReactNode; onClick: () => void }) {
    const {data: featured, isLoading} = useFeaturedCategoryListings(name);

    const isAllCategories = name === 'All Categories';

    const tooltip = isAllCategories
        ? "View listings from all categories"
        : isLoading
            ? <CircularProgress size={18}/>
            : (
                <Stack>
                    {featured?.length
                        ? featured.map(listing => (
                            <Typography key={listing.listingId}
                                        variant="body2">• {pretty(listing.item.title)}</Typography>
                        ))
                        : <Typography variant="body2">No active items</Typography>}
                </Stack>
            );

    return (
        <Tooltip title={tooltip} placement="right" arrow enterDelay={400}>
            <Paper elevation={3}
                   sx={{
                       p: 2, textAlign: 'center', cursor: 'pointer',
                       transition: 'transform 0.2s', '&:hover': {transform: 'scale(1.04)'}
                   }}
                   onClick={onClick}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    {icon}
                    <Typography fontWeight={600}>{pretty(name)}</Typography>
                </Stack>
            </Paper>
        </Tooltip>
    );
}