import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import {LiveBid, useLiveBids} from "../hooks/useLiveBids";

import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {pretty} from "../pages/CreateListingPage";
import axios from "../api/axios.ts";

export default function LiveBidFeed() {
    const {data: feed = []} = useQuery<LiveBid[]>({
        queryKey: ['liveBids'],
        queryFn: () => axios.get<LiveBid[]>('/bids/recent').then(r => r.data),
        staleTime: 30_000,
    });
    useLiveBids();

    const nav = useNavigate();

    if (!feed.length) return null;

    const renderBid = (bid: LiveBid, keySuffix: string) => (
        <motion.div
            key={`${bid.listingId}-${bid.amount}-${bid.bidderId}-${keySuffix}`}
            layout
            exit={{opacity: 0, height: 0}}
            style={{overflow: "hidden"}}
        >
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                    cursor: "pointer",
                    "&:hover": {bgcolor: "action.hover"},
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                }}
                onClick={() => nav(`/listings/${bid.listingId}`)}
            >
                <Avatar sx={{width: 28, height: 28}}>
                    {bid.firstName?.[0] ?? bid.username[0]}
                </Avatar>

                <Typography
                    variant="body2"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <b>{pretty(bid.firstName) || bid.username}</b>&nbsp;just bid&nbsp;
                    <b>${bid.amount}</b>&nbsp;on&nbsp;
                    <i>{bid.title}</i>
                </Typography>
            </Stack>
        </motion.div>
    );

    return (
        <Paper elevation={3} sx={{p: 1.5, overflow: "hidden", mt: 3, maxHeight: 500, width: 350}}>
            <Typography variant="subtitle1"
                        sx={{
                            mb: 1,
                            fontWeight: 600,
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            alignItems: 'center'
                        }}
            >
                <motion.span
                    animate={{opacity: [0.3, 1, 0.3]}}
                    transition={{duration: 1.5, repeat: Infinity, ease: "easeInOut"}}
                    style={{marginRight: '0.5ch'}}
                >
                    🔴
                </motion.span>
                Live Bids
            </Typography>

            <Box sx={{overflow: 'hidden'}}>
                <Box
                    component={motion.div}
                    animate={{y: ["0%", "-50%"]}}
                    transition={{
                        ease: "linear",
                        duration: feed.length * 3,
                        repeat: Infinity,
                    }}
                    sx={{display: "flex", flexDirection: "column", gap: 1}}
                >
                    <AnimatePresence initial={false}>
                        {feed.map(bid => renderBid(bid, 'first'))}
                        {feed.map(bid => renderBid(bid, 'second'))}
                    </AnimatePresence>
                </Box>
            </Box>
        </Paper>
    );
}