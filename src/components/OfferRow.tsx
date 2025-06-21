import {OfferResponse} from '../api/offerApi';
import {useUser} from '../hooks/useUser';
import {Box, IconButton, Stack, Typography} from '@mui/material';
import {formatDistanceToNow} from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    offer: OfferResponse;
    isSeller: boolean;
    isMine: boolean;
    onAccept?: () => void;
    onReject?: () => void;
    onWithdraw?: () => void;
    disabled?: boolean;
    showUsername?: boolean;
}

export function OfferRow({
                             offer,
                             isSeller,
                             isMine,
                             onAccept,
                             onReject,
                             onWithdraw,
                             disabled,
                             showUsername = true,
                         }: Props) {
    const {data: offeror} = useUser(offer.offerorId);

    const canAccept = isSeller && offer.status === 'PENDING';
    const canReject = isSeller && offer.status === 'PENDING';
    const canWithdraw = isMine && offer.status === 'PENDING';

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{width: '100%'}}>
            <Stack direction="row" spacing={1} alignItems="center">
                {showUsername && (
                    <Typography fontWeight="bold">
                        {offeror?.username ?? '—'}
                    </Typography>
                )}
                <Typography>-${offer.amount}</Typography>
                <Typography color="text.secondary">
                    ({formatDistanceToNow(new Date(offer.createdAt), {addSuffix: true})})
                </Typography>
                {offer.status !== 'PENDING' && (
                    <Typography
                        sx={{ml: 0.5}}
                        color={
                            offer.status === 'ACCEPTED'
                                ? 'success.main'
                                : 'error.main'
                        }
                    >
                        {offer.status}
                    </Typography>
                )}
            </Stack>

            <Stack direction="row" spacing={0.5}>
                {canAccept && (
                    <IconButton size="small" onClick={onAccept} disabled={disabled}>
                        <CheckIcon/>
                    </IconButton>
                )}
                {canReject && (
                    <IconButton size="small" onClick={onReject} disabled={disabled}>
                        <CloseIcon/>
                    </IconButton>
                )}
                {canWithdraw && (
                    <IconButton size="small" onClick={onWithdraw} disabled={disabled}>
                        <CloseIcon/>
                    </IconButton>
                )}
            </Stack>
        </Box>
    );
}
