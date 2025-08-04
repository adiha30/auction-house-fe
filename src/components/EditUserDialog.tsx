/**
 * EditUserDialog displays a dialog for editing a user's profile information.
 *
 * @module components/EditUserDialog
 */

import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import {User} from "../api/userApi.ts";
import {EditProfileForm} from '../pages/EditProfilePage'; // Assuming EditProfileForm is exported from here

/**
 * Type representing the props for the EditUserDialog component.
 * @property open Indicates whether the dialog is open.
 * @property onClose Callback function to close the dialog.
 * @property user The user being edited.
 * @property currentUser The currently logged-in user.
 */
type EditUserDialogProps = {
    open: boolean;
    onClose: () => void;
    user: User;
    currentUser: User;
};

/**
 * Renders a dialog for editing a user's profile.
 *
 * @param open - Whether the dialog is open.
 * @param onClose - Callback to close the dialog.
 * @param user - The user being edited.
 * @param currentUser - The currently logged-in user.
 */
export default function EditUserDialog({open, onClose, user, currentUser}: EditUserDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User: {user.username}</DialogTitle>
            <DialogContent sx={{pt: '20px !important'}}>
                <EditProfileForm
                    userToEdit={user}
                    currentUser={currentUser}
                    onSave={onClose}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}