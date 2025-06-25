import {useRef} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {ListingSummary} from '../api/listingApi';
import ListingCard from './ListingCard.tsx';

export default function Section({
                                    title,
                                    listings,
                                    token,
                                    isSellerSection = false,
                                }: {
    title: string;
    listings: ListingSummary[];
    token: string | null;
    isSellerSection?: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const {current} = scrollRef;
            const scrollAmount = current.clientWidth;
            current.scrollBy({left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth'});
        }
    };

    if (!listings || listings.length === 0) return null;

    const showArrows = listings.length > 4;

    return (
        <Box mb={3} mt={3}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Box sx={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                {showArrows && (
                    <IconButton
                        onClick={() => scroll('left')}
                        sx={{
                            position: 'absolute',
                            left: -16,
                            zIndex: 1,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {backgroundColor: 'white'}
                        }}
                    >
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                )}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {display: 'none'},
                        scrollbarWidth: 'none',
                        padding: '8px 0',
                        justifyContent: showArrows ? 'flex-start' : 'center'
                    }}
                >
                    {listings.filter(Boolean).map((listing) => (
                        <Box key={listing.listingId} sx={{width: 300, flexShrink: 0}}>
                            <ListingCard listing={listing} token={token} isSeller={isSellerSection}/>
                        </Box>
                    ))}
                </Box>
                {showArrows && (
                    <IconButton
                        onClick={() => scroll('right')}
                        sx={{
                            position: 'absolute',
                            right: -16,
                            zIndex: 1,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {backgroundColor: 'white'}
                        }}
                    >
                        <ArrowForwardIosIcon/>
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}