/**
 * ResolveDisputeDialog displays a confirmation dialog for resolving a dispute.
 *
 * @module components/ResolveDisputeDialog
 */

import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

/**
 * Props for the ResolveDisputeDialog component.
 * @property open - Whether the dialog is open.
 * @property onClose - Callback to close the dialog.
 * @property onConfirm - Callback to confirm resolving the dispute.
 */
type ResolveDisputeDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Renders a dialog to confirm dispute resolution.
 *
 * @param open - Whether the dialog is open.
 * @param onClose - Callback to close the dialog.
 * @param onConfirm - Callback to confirm resolving the dispute.
 */
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
