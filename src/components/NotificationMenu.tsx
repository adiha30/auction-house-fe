/**
 * NotificationMenu displays a menu of user notifications, allowing marking as read/unread and navigation.
 *
 * @module components/NotificationMenu
 */

/**
 * Renders a notification menu with unread count and notification actions.
 *
 * @returns The notification menu component.
 */
import {JSX, MouseEvent, useState} from "react";
import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import {Notification, useNotifications} from "../hooks/useNotifications";
import {useNavigate} from "react-router-dom";

/**
 * NotificationMenu displays a menu of user notifications, allowing marking as read/unread and navigation.
 *
 * @returns {JSX.Element} The notification menu component.
 */
export default function NotificationMenu(): JSX.Element {
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        isLoadingNotifications,
        isLoadingUnreadCount,
        markToggle,
        markAllAsRead,
    } = useNotifications();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const badgeContent = unreadCount > 9 ? "9+" : unreadCount;
    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
                <Badge
                    badgeContent={
                        isLoadingUnreadCount ? <CircularProgress size={12} color="inherit"/> : badgeContent
                    }
                    color="error"
                >
                    <NotificationsIcon/>
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{sx: {width: 360, maxHeight: 400, p: 1}}}
            >
                <Box sx={{display: "flex", justifyContent: "space-between", px: 1, py: 0.5}}>
                    <Typography variant="subtitle1">Notifications</Typography>
                    <Button size="small" disabled={unreadCount === 0} onClick={markAllAsRead}>
                        Mark all as read
                    </Button>
                </Box>
                <Divider/>

                {isLoadingNotifications ? (
                    <Box sx={{display: "flex", justifyContent: "center", p: 2}}>
                        <CircularProgress size={24}/>
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{p: 2}}>
                        <Typography variant="body2" color="text.secondary">
                            No notifications.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{maxHeight: 320, overflowY: "auto"}}>
                        {notifications.map((notification: Notification) => (
                            <MenuItem
                                key={notification.notificationId}
                                onClick={() => {
                                    if (!notification.read) markToggle(notification.notificationId, true);
                                    if (notification.targetUrl) {
                                        navigate(`${notification.targetUrl}`);
                                    }
                                    setAnchorEl(null);
                                }}
                                sx={{alignItems: "flex-start"}}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: notification.read ? "normal" : "bold",
                                                whiteSpace: "normal"
                                            }}
                                        >
                                            {notification.text}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {fmtDate(notification.createdAt)}
                                        </Typography>
                                    }
                                    sx={{mr: 4}}
                                />

                                <ListItemSecondaryAction>
                                    {notification.read ? (
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={(e: MouseEvent) => {
                                                e.stopPropagation();
                                                markToggle(notification.notificationId, false);
                                            }}
                                        >
                                            <MarkEmailUnreadIcon fontSize="small"/>
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={(e: MouseEvent) => {
                                                e.stopPropagation();
                                                markToggle(notification.notificationId, true);
                                            }}
                                        >
                                            <MarkEmailReadIcon fontSize="small"/>
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </MenuItem>
                        ))}
                    </Box>
                )}
            </Menu>
        </>
    );
}
