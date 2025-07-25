import {ReactNode, useRef, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

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