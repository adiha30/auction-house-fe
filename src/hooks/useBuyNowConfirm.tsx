/**
 * Hook for creating a buy now confirmation dialog.
 * Provides a reusable confirmation dialog for "Buy Now" actions in the auction system.
 */
import {ReactNode, useRef, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

 /**
 * Custom hook that provides a confirmation dialog for "Buy Now" actions.
 * @returns {Object} Object containing the ask function and dialog component
 * @returns {Function} ask - Function to open the dialog with a callback and optional price
 * @returns {ReactNode} dialog - The dialog component to be rendered
 */
export function useBuyNowConfirm() {
    const [open, setOpen] = useState(false);
    const onConfirmRef = useRef<() => void>(() => {
    });
    const priceRef = useRef<string>('this item');

    const ask = (onConfirm: () => void, price?: string) => {
        onConfirmRef.current = onConfirm;
        priceRef.current = price ?? 'this item';
        setOpen(true);
    };

    const dialog: ReactNode = (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Confirm Buy&nbsp;Now</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to buy&nbsp;out&nbsp;
                    <strong>{priceRef.current}</strong>&nbsp;right now? <br/>
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{pr: 3, pb: 2}}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        setOpen(false);
                        onConfirmRef.current();
                    }}
                >
                    Yes, Buy&nbsp;Now
                </Button>
            </DialogActions>
        </Dialog>
    );

    return {ask, dialog};
}