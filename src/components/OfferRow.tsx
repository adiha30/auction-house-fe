import {OfferResponse} from "../api/offerApi.ts";
import {useUser} from "../hooks/useUser.ts";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {formatDistanceToNow} from "date-fns";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/UndoRounded";

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

export const OfferRow = ({
                             offer,
                             isMine,
                             showUsername,
                             isSeller,
                             onAccept,
                             onReject,
                             onWithdraw,
                             disabled,
                         }: Props) => {
    const {data: offeror} = useUser(offer.offerorId);

    return (
        <Box sx={{borderBottom: "1px solid #eee", pb: 1}}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>
                    {showUsername !== false && (
                        <>
                            <strong>{offeror?.username ?? "Unknown User"}</strong> -
                        </>
                    )}
                    ${offer.amount}{' '}
                    <Box component="span" color="text.secondary">
                        (
                        {formatDistanceToNow(new Date(offer.createdAt), {addSuffix: true})}
                        )
                    </Box>
                </Typography>

                {isSeller && offer.status === 'PENDING' && (
                    <>
                        <IconButton
                            size="small"
                            title="Accept"
                            onClick={onAccept}
                            disabled={disabled}
                        >
                            <CheckIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            size="small"
                            title="Reject"
                            onClick={onReject}
                            disabled={disabled}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </>
                )}

                {isMine && offer.status === 'PENDING' && (
                    <IconButton size="small" title="Withdraw" onClick={onWithdraw} disabled={disabled}>
                        <UndoIcon fontSize="small"/>
                    </IconButton>
                )}

                {offer.status !== 'PENDING' && (
                    <Typography
                        sx={{ml: 1}}
                        color={offer.status === 'ACCEPTED' ? 'success.main' : 'error.main'}
                    >
                        {offer.status}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};