import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {Box, Button, keyframes, Stack, Tooltip, Typography, useTheme} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {useFeaturedListings} from '../hooks/useFeaturedListings';
import {useCreateBid} from '../hooks/useCreateBid';
import {useCountdown} from '../hooks/useCountdown';
import {toTitleCase} from "../utils/text.ts";
import {useBuyNowConfirm} from "../hooks/useBuyNowConfirm.tsx";

const pulse = keyframes`
  0%   { opacity: .85; transform: scale(1); }
  50%  { opacity: 1;   transform: scale(1.04); }
  100% { opacity: .85; transform: scale(1); }
`;

export default function HeroCarousel() {
    const {data: featured = []} = useFeaturedListings(6);
    if (!featured.length) return null;

    return (
        <Box sx={{width: '100%', mt: 2}}>
            <Slider
                autoplay autoplaySpeed={7000} fade
                dots arrows infinite slidesToShow={1} adaptiveHeight
            >
                {featured.map(l => <HeroSlide key={l.listingId} listing={l}/>)}
            </Slider>
        </Box>
    );
}

function HeroSlide({listing}: { listing: any }) {
    const nav = useNavigate();
    const {token} = useAuth() || {};
    const createBid = useCreateBid(listing.listingId);
    const {ask, dialog} = useBuyNowConfirm();
    const {palette} = useTheme();
    const countdown = useCountdown(listing.endTime);
    const buyAvailable = !!listing.buyNowPrice;
    const bg = listing.item?.imageIds?.[0];

    return (
        <Box
            className="hero-slide"
            sx={{
                position: 'relative',
                height: {xs: 280, sm: 420, md: 500},
                display: 'flex', alignItems: 'center',
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0)), url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Stack spacing={2} sx={{zIndex: 1, pl: {xs: 2, sm: 6}, maxWidth: 520}}>
                <Typography variant="h3" fontWeight={700} color="#fff">
                    {toTitleCase(listing.item.title)}
                </Typography>

                <Typography variant="h6" color="#fff">
                    Current Price: <b>${listing.latestBidAmount ?? listing.startPrice}</b>
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: '#fff',
                        fontVariantNumeric: 'tabular-nums',
                        animation: countdown.isUrgent ? `${pulse} 1.2s ease-in-out infinite` : undefined
                    }}
                >
                    Ends in: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                        variant="contained" size="large"
                        sx={heroBtnSx(palette.primary.main)}
                        onClick={() => nav(`/listings/${listing.listingId}`)}
                    >
                        View Details
                    </Button>

                    <Tooltip title={!token ? 'Log in to bid' : ''}>
                        <span>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={heroBtnSx('#fff', true)}
                                disabled={!token}
                                onClick={() => nav(`/listings/${listing.listingId}#bid`)}
                            >
                              Bid Now
                            </Button>
                          </span>
                    </Tooltip>


                    {token && buyAvailable && (
                        <Button
                            variant="contained" size="large" color="success"
                            sx={heroBtnSx(palette.success.main)}
                            onClick={() =>
                                ask(
                                    () => createBid.mutate({amount: listing.buyNowPrice, buy_now: true}),
                                    `$${listing.buyNowPrice}`
                                )
                            }
                        >
                            Buy Now ${listing.buyNowPrice}
                        </Button>
                    )}
                </Stack>
            </Stack>
            {dialog}
        </Box>
    );
}

const heroBtnSx = (bg: string, outlined = false) => ({
    borderRadius: 40,
    px: 3,
    fontWeight: 600,
    backdropFilter: outlined ? 'blur(2px)' : undefined,
    borderColor: outlined ? 'rgba(255,255,255,.7)' : undefined,
    transition: 'transform .25s, box-shadow .25s, background .25s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 6,
        background: outlined ? 'rgba(255,255,255,.15)' : bg,
    }
});
