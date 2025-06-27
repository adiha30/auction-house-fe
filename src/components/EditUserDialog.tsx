import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import {User} from "../api/userApi.ts";
import {EditProfileForm} from '../pages/EditProfilePage'; // Assuming EditProfileForm is exported from here

interface EditUserDialogProps {
    open: boolean;
    onClose: () => void;
    user: User;
    currentUser: User;
}

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