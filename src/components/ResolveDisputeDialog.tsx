import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

interface ResolveDisputeDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ResolveDisputeDialog: React.FC<ResolveDisputeDialogProps> = ({open, onClose, onConfirm}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="resolve-dispute-dialog-title"
            aria-describedby="resolve-dispute-dialog-description"
        >
            <DialogTitle id="resolve-dispute-dialog-title">{"Resolve Dispute?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="resolve-dispute-dialog-description">
                    Are you sure you want to resolve this dispute? This action will close the dispute, and no further messages can be sent.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Yes, Resolve
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResolveDisputeDialog;

