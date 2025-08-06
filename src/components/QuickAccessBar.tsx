/**
 * QuickAccessBar displays quick access buttons for common user actions like viewing bids, watchlist, and creating listings.
 *
 * @module components/QuickAccessBar
 */

import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/material";

/**
 * Props for the QuickAccessBar component.
 * @property onViewBids - Callback to view user's bids.
 * @property areBids - Whether the user has bids.
 * @property onWatchlist - Callback to view the watchlist.
 * @property areWatches - Whether the user has items in the watchlist.
 * @property isAdmin - Whether the current user is an admin.
 */
type Props = {
    onViewBids?: () => void;
    areBids?: boolean;
    onWatchlist?: () => void;
    areWatches?: boolean;
    isAdmin: boolean;
};

/**
 * Renders a bar with quick access buttons for user actions.
 *
 * @param onViewBids - Callback to view user's bids.
 * @param areBids - Whether the user has bids.
 * @param onWatchlist - Callback to view the watchlist.
 * @param areWatches - Whether the user has items in the watchlist.
 * @param isAdmin - Whether the current user is an admin.
 */
export default function QuickAccessBar({onViewBids, areBids, onWatchlist, areWatches, isAdmin}: Props) {
    const nav = useNavigate();

    return (
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{mt: 2, mb: 4}}>
            {!isAdmin && (
                <>
                    {areBids && (
                        <Button variant="contained" onClick={onViewBids}>View My Bids</Button>
                    )}
                    {areWatches && (
                        <Button variant="contained" onClick={onWatchlist}>Watchlist</Button>
                    )}
                    <Button variant="outlined" onClick={() => nav("/create")}>Sell an Item</Button>
                </>
            )}

            <Button variant="outlined" onClick={() => nav("/listings")}>Explore Categories</Button>
        </Stack>
    );
}