/**
 * OfferRow displays a row representing an offer, with actions for accepting, rejecting, or withdrawing.
 *
 * @module components/OfferRow
 */
import {OfferResponse} from '../api/offerApi';
import {useUser} from '../hooks/useUser';
import {Box, IconButton, Stack, Typography} from '@mui/material';
import {formatDistanceToNow} from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Props for the OfferRow component.
 * @property offer - The offer to display.
 * @property isSeller - Whether the current user is the seller.
 * @property isMine - Whether the offer belongs to the current user.
 * @property onAccept - Callback to accept the offer.
 * @property onReject - Callback to reject the offer.
 * @property onWithdraw - Callback to withdraw the offer.
 * @property disabled - Whether the action buttons are disabled.
 * @property showUsername - Whether to show the offeror's username.
 */
type Props = {
    offer: OfferResponse;
    isSeller: boolean;
    isMine: boolean;
    onAccept?: () => void;
    onReject?: () => void;
    onWithdraw?: () => void;
    disabled?: boolean;
    showUsername?: boolean;
}

/**
 * Renders a row for an offer with actions for seller or offeror.
 *
 * @param offer - The offer to display.
 * @param isSeller - Whether the current user is the seller.
 * @param isMine - Whether the offer belongs to the current user.
 * @param onAccept - Callback to accept the offer.
 * @param onReject - Callback to reject the offer.
 * @param onWithdraw - Callback to withdraw the offer.
 * @param disabled - Whether the action buttons are disabled.
 * @param showUsername - Whether to show the offeror's username.
 */
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
