import {ListingDetails} from "../api/listingApi.ts";
import {DisputeReason} from "../api/disputeApi.ts";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {toTitleCase} from "../utils/text.ts";
import React from "react";

interface CreateDisputeModalProps {
    open: boolean;
    onClose: () => void;
    listing: ListingDetails;
    onSubmit: (reason: DisputeReason, details: string) => void;
}

const CreateDisputeModal: React.FC<CreateDisputeModalProps> = ({open, onClose, listing, onSubmit}) => {
    const [reason, setReason] = React.useState<DisputeReason>(DisputeReason.ITEM_NOT_AS_DESCRIBED);
    const [details, setDetails] = React.useState("");

    const handleSubmit = () => {
        onSubmit(reason, details);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Open a Dispute For: {toTitleCase(listing.item.title)}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    You are opening a dispute for the listing: <strong>{listing.item.title}</strong>.
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="dispute-reason-label">Reason</InputLabel>
                    <Select
                        labelId="dispute-reason-label"
                        value={reason}
                        label="Reason"
                        onChange={(e) => setReason(e.target.value as DisputeReason)}>
                        {Object.values(DisputeReason).map((reasonValue) => (
                            <MenuItem key={reasonValue} value={reasonValue}>{reasonValue}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="normal"
                    label="Details (optional)"
                    fullWidth
                    multiline
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Submit Dispute</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDisputeModal;