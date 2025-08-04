/**
 * Section displays a horizontally scrollable section of listing cards with a title and optional navigation arrows.
 *
 * @module components/Section
 */

/**
 * Renders a section with a title and a horizontal list of listing cards.
 *
 * @param title - The section title.
 * @param listings - Array of listings to display.
 * @param token - The authentication token of the current user.
 * @param userId - The ID of the current user (optional).
 */
import {JSX, useRef} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {ListingSummary} from '../api/listingApi';
import ListingCard from './ListingCard.tsx';

/**
 * Renders a section with a title and a horizontal list of listing cards.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The section title.
 * @param {ListingSummary[]} props.listings - Array of listings to display.
 * @param {string|null} props.token - The authentication token of the current user.
 * @param {string} [props.userId] - The ID of the current user (optional).
 * @returns {JSX.Element|null} The rendered section or null if no listings.
 */
export default function Section({
                                    title,
                                    listings,
                                    token,
                                    userId,
                                }: {
    title: string;
    listings: ListingSummary[];
    token: string | null;
    userId?: string;
}): JSX.Element | null {
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
                            <ListingCard listing={listing} token={token} isSeller={userId === listing.seller.userId}/>
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