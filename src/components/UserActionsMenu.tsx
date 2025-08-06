/**
 * UserActionsMenu displays action buttons for viewing, editing, activating, or deactivating a user.
 *
 * @module components/UserActionsMenu
 */
import {Button} from '@mui/material';
import {Delete, Edit as Pencil, RestartAlt, Visibility as Eye} from "@mui/icons-material";
import {User} from "../api/userApi.ts";

/**
 * Props for the UserActionsMenu component.
 * @property user - The user for which actions are shown.
 * @property onView - Callback to view the user.
 * @property onEdit - Callback to edit the user.
 * @property onDeactivate - Callback to deactivate the user.
 * @property onActivate - Callback to activate the user.
 */
type UserActionsMenuProps = {
    user: User;
    onView: (user: User) => void;
    onEdit: (user: User) => void;
    onDeactivate: (user: User) => void;
    onActivate: (user: User) => void;
}

/**
 * Renders a menu of action buttons for user management.
 *
 * @param user - The user for which actions are shown.
 * @param onView - Callback to view the user.
 * @param onEdit - Callback to edit the user.
 * @param onDeactivate - Callback to deactivate the user.
 * @param onActivate - Callback to activate the user.
 */
export default function UserActionsMenu({user, onView, onEdit, onDeactivate, onActivate}: UserActionsMenuProps) {
    return (
        <>
            <Button variant="contained" color="primary" sx={{mr: 1.5}} onClick={() => onView(user)}>
                <Eye/>&nbsp;View
            </Button>
            <Button variant="contained" color="inherit" sx={{mr: 1.5}} onClick={() => onEdit(user)}>
                <Pencil/>&nbsp;Edit
            </Button>
            {user.active && (<Button variant="contained" color="error" sx={{mr: 1.5, width: "150px"}}
                                     onClick={() => onDeactivate(user)}>
                <Delete/>&nbsp;Deactivate
            </Button>)}
            {!user.active && (<Button variant="contained" color="success" sx={{mr: 1.5, width: "150px"}}
                                      onClick={() => onActivate(user)}>
                <RestartAlt/>&nbsp;Activate
            </Button>)}
        </>
    );
}