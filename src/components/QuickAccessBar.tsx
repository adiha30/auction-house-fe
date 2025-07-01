import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/material";

type Props = {
    onViewBids?: () => void;
    areBids?: boolean;
    onWatchlist?: () => void;
    areWatches?: boolean;
    isAdmin: boolean;
};

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