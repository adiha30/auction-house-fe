import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {Send} from '@mui/icons-material';
import {useAddDisputeMessage, useDispute} from '../hooks/useDisputes.ts';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {useListing} from '../hooks/useListing';
import {useUser} from '../hooks/useUser';
import {DisputeMessage} from '../api/disputeApi';
import {pretty} from "./CreateListingPage.tsx";

const DisputeMessageItem: React.FC<{ message: DisputeMessage, isCurrentUser: boolean }> = ({
                                                                                               message,
                                                                                               isCurrentUser
                                                                                           }) => {
    const {data: sender} = useUser(message.senderId);
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            mb: 1,
        }}>
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    bgcolor: isCurrentUser ? 'primary.light' : 'grey.200',
                    color: isCurrentUser ? 'primary.contrastText' : 'inherit',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                }}
            >
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>{pretty(sender?.username || 'User')}</Typography>
                <Typography variant="body1">{message.message}</Typography>
            </Paper>
        </Box>
    );
};

const DisputePage: React.FC = () => {
    const {disputeId} = useParams<{ disputeId: string }>();
    const {data: dispute, isLoading, isError} = useDispute(disputeId!);
    const {data: currentUser} = useCurrentUser();
    const addMessageMutation = useAddDisputeMessage(disputeId!);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const {data: listing, isLoading: isListingLoading} = useListing(dispute?.listingId);
    const {data: winner, isLoading: isWinnerLoading} = useUser(dispute?.winnerId);
    const {data: seller, isLoading: isSellerLoading} = useUser(dispute?.sellerId);

    const sortedMessages = useMemo(
        () =>
            dispute?.disputeMessages
                ? [...dispute.disputeMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                : [],
        [dispute?.disputeMessages]
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [sortedMessages]);

    if (isLoading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>;
    }

    if (isError || !dispute) {
        return <Typography color="error" sx={{textAlign: 'center', mt: 4}}>Failed to load dispute details.</Typography>;
    }

    const handleSendMessage = () => {
        if (newMessage.trim() && currentUser) {
            addMessageMutation.mutate({message: newMessage, senderId: currentUser.userId});
            setNewMessage('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const canParticipate = currentUser?.role === 'ADMIN' || [dispute.sellerId, dispute.winnerId].includes(currentUser?.userId || '');
    const isDisputeOpen = dispute.status === 'OPEN';

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            // Assuming a header/appbar height of 64px. 3rem is for the padding (p: 3 -> 24px -> 1.5rem * 2)
            minHeight: 'calc(100vh - 64px - 3rem)',
        }}>
            <Grid container spacing={3} sx={{flexGrow: 1}}>
                {/* Left Column: Details */}
                <Grid item xs={12} md={5}>
                    <Card>
                        {isListingLoading ? (
                            <Skeleton variant="rectangular" height={250}/>
                        ) : (
                            <CardMedia
                                component="img"
                                height="250"
                                image={listing?.item.imageIds[0] || '/placeholder.png'}
                                alt={listing?.item.title}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {isListingLoading ? <Skeleton/> : pretty(listing?.item.title ?? "")}
                            </Typography>
                            <Divider sx={{my: 2}}/>
                            <Typography variant="h6" gutterBottom>Dispute Details</Typography>
                            <Stack spacing={1} sx={{mt: 1}}>
                                <Typography><b>Status:</b> {dispute.status}</Typography>
                                <Typography><b>Reason:</b> {dispute.reason}</Typography>
                                <Typography>
                                    <b>Seller:</b> {isSellerLoading ?
                                    <Skeleton width="50%"/> : pretty(seller?.username || 'N/A')}
                                </Typography>
                                <Typography>
                                    <b>Winner:</b> {isWinnerLoading ?
                                    <Skeleton width="50%"/> : pretty(winner?.username || 'N/A')}
                                </Typography>
                            </Stack>
                        </CardContent>
                        {currentUser?.role === 'ADMIN' && isDisputeOpen && (
                            <>
                                <Divider/>
                                <CardActions sx={{justifyContent: 'flex-end', p: 2}}>
                                    <Button variant="contained" color="primary">Resolve Dispute</Button>
                                </CardActions>
                            </>
                        )}
                    </Card>
                </Grid>

                {/* Right Column: Messages */}
                <Grid item xs={12} md={7} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Card sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Messages</Typography>
                        </CardContent>
                        <CardContent sx={{flexGrow: 1, overflowY: 'auto', p: 2, borderTop: 1, borderColor: 'divider'}}>
                            {sortedMessages.length > 0 ? sortedMessages.map(msg => (
                                <DisputeMessageItem key={msg.messageId} message={msg}
                                                    isCurrentUser={msg.senderId === currentUser?.userId}/>
                            )) : <Typography sx={{textAlign: 'center', color: 'text.secondary'}}>No messages
                                yet.</Typography>}
                            <div ref={messagesEndRef}/>
                        </CardContent>
                        {canParticipate && isDisputeOpen && (
                            <Box sx={{p: 2, borderTop: 1, borderColor: 'divider'}}>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a message..."
                                        disabled={addMessageMutation.isPending}
                                    />
                                    <Button variant="contained" onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || addMessageMutation.isPending}>
                                        <Send/>
                                    </Button>
                                </Stack>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DisputePage;