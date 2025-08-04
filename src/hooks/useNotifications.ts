/**
 * Hook and types for managing user notifications.
 * Provides functionality to fetch, mark as read/unread, and receive real-time notifications via WebSockets.
 */
import axios from "../api/axios.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {enqueueSnackbar} from "notistack";
import {useEffect} from "react";
import {Client, IMessage} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {invalidateFromNotification} from "../utils/invalidateMap.ts";
import {useCurrentUser} from "./useCurrentUser.ts";
import {Role} from "../api/authApi.ts";

/**
 * Enum of all possible notification types in the system.
 */
export enum NotificationType {
    NEW_BID = "NEW_BID",
    OUTBID = "OUTBID",
    NEW_OFFER = "NEW_OFFER",
    OFFER_ACCEPTED = "OFFER_ACCEPTED",
    OFFER_REJECTED = "OFFER_REJECTED",
    OFFER_WITHDRAWN = "OFFER_WITHDRAWN",
    AUCTION_ENDED = "AUCTION_ENDED",
    AUCTION_CREATED = "AUCTION_CREATED",
    BOUGHT_OUT = "BOUGHT_OUT",
    DISPUTE_OPENED = "DISPUTE_OPENED",
    DISPUTE_CLOSED = "DISPUTE_CLOSED",
    DISPUTE_MESSAGE = "DISPUTE_MESSAGE",
    WATCHED_CHANGE = "WATCHED_CHANGE",
    LISTING_REMOVED_BY_ADMIN = "LISTING_REMOVED_BY_ADMIN",
}

/**
 * Interface representing a notification in the system.
 */
export interface Notification {
    notificationId: string;
    type: NotificationType;
    relatedUserId?: string | null;
    listingId?: string | null;
    text: string;
    createdAt: string;
    targetUrl: string;
    read: boolean;
}

/**
 * Fetches all notifications for the current user.
 * @returns {Promise<Notification[]>} Promise resolving to an array of notifications
 */
/**
 * Fetches all notifications for the current user.
 */
const fetchNotifications = async () =>
    (await axios.get<Notification[]>("/notifications")).data;

/**
 * Fetches the count of unread notifications for the current user.
 * @returns {Promise<number>} Promise resolving to the count of unread notifications
 */
const fetchUnreadCount = async (): Promise<number> =>
    (await axios.get<{ unread: number }>("/notifications/count")).data.unread;

/**
 * Marks a notification as read.
 * @param {string} id - The ID of the notification to mark as read
 * @returns {Promise<void>} Promise that resolves when the operation completes
 */
const markRead = (id: string): Promise<void> => axios.post(`/notifications/${id}/read`).then(() => {
});

/**
 * Marks a notification as unread.
 * @param {string} id - The ID of the notification to mark as unread
 * @returns {Promise<void>} Promise that resolves when the operation completes
 */
const markUnread = (id: string): Promise<void> => axios.post(`/notifications/${id}/unread`).then(() => {
});

/**
 * Custom hook that provides functionality to manage notifications.
 * Includes fetching notifications, marking them as read/unread, and receiving real-time updates.
 * @returns {Object} Object containing notifications, counts, and functions to manage notifications
 * @returns {Notification[]} notifications - Array of user notifications
 * @returns {number} unreadCount - Count of unread notifications
 * @returns {boolean} isLoadingNotifications - Whether notifications are being loaded
 * @returns {boolean} isLoadingUnreadCount - Whether unread count is being loaded
 * @returns {Function} markToggle - Function to toggle read/unread status of a notification
 * @returns {Function} markAllAsRead - Function to mark all notifications as read
 */
export function useNotifications() {
    const {userId, token} = useAuth()!;
    const queryClient = useQueryClient();

    const {data: notifications = []} = useQuery({
        queryKey: ["notifications", userId],
        queryFn: fetchNotifications,
        enabled: !!userId,
        staleTime: 30_000,
    });

    const {data: unreadCount = 0} = useQuery({
        queryKey: ["unreadCount", userId],
        queryFn: fetchUnreadCount,
        enabled: !!userId,
        staleTime: 15_000,
    });

    const toggleMutation = useMutation<
        void,
        unknown,
        { id: string; makeRead: boolean },
        { prevNotifs?: Notification[]; prevUnread?: number }
    >({
        mutationFn: ({id, makeRead}) => (makeRead ? markRead(id) : markUnread(id)),
        onMutate: async ({id, makeRead}) => {
            await queryClient.cancelQueries({queryKey: ["notifications", userId]});
            await queryClient.cancelQueries({queryKey: ["unreadCount", userId]});

            const prevNotifs = queryClient.getQueryData<Notification[]>(["notifications", userId]);
            const prevUnread = queryClient.getQueryData<number>(["unreadCount", userId]);

            queryClient.setQueryData<Notification[]>(["notifications", userId], (old = []) =>
                old.map((n) => (n.notificationId === id ? {...n, read: makeRead} : n))
            );
            queryClient.setQueryData<number>(["unreadCount", userId], (old = 0) =>
                Math.max(0, old + (makeRead ? -1 : 1))
            );

            return {prevNotifs, prevUnread};
        },
        onError: (_e, _vars, ctx) => {
            if (ctx?.prevNotifs) queryClient.setQueryData(["notifications", userId], ctx.prevNotifs);
            if (ctx?.prevUnread !== undefined) queryClient.setQueryData(["unreadCount", userId], ctx.prevUnread);
            enqueueSnackbar("Could not update notification", {variant: "error"});
        },
    });

    const markAllMutation = useMutation<void>({
        mutationFn: async () => {
            const ids = notifications.filter((n) => !n.read).map((n) => n.notificationId);
            await Promise.all(ids.map(markRead));
        },
        onMutate: async () => {
            await queryClient.cancelQueries({queryKey: ["notifications", userId]});
            await queryClient.cancelQueries({queryKey: ["unreadCount", userId]});
            queryClient.setQueryData<Notification[]>(["notifications", userId], (old = []) =>
                old.map((n) => ({...n, read: true}))
            );
            queryClient.setQueryData(["unreadCount", userId], 0);
        },
        onError: () => enqueueSnackbar("Failed to mark all notifications", {variant: "error"}),
    });

    const {data: user} = useCurrentUser();

    useEffect(() => {
        const log = (...a: unknown[]) => console.info("[WS]", ...a);

        if (!userId || !token) return;
        const isAdmin = user?.role === Role.ADMIN;

        const stomp = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL.replace(/\$/, "")}/ws`),
            debug: log,
            reconnectDelay: 0,
            onConnect: () => {
                stomp.subscribe(`/topic/notifications/${isAdmin ? "admin" : userId}`, (m: IMessage) => {
                    try {
                        const notification = JSON.parse(m.body) as Notification;
                        enqueueSnackbar(notification.text, {
                            variant: "info",
                            anchorOrigin: {vertical: "bottom", horizontal: "left"},
                            autoHideDuration: 5000,
                        });
                        queryClient.setQueryData<Notification[]>(["notifications", userId], (old = []) => [notification, ...old]);
                        queryClient.setQueryData(
                            ["unreadCount", userId],
                            (old: number = 0) => old + 1
                        )

                        if (notification.type === NotificationType.DISPUTE_MESSAGE) {
                            const disputeId = notification.targetUrl.split('/').pop();
                            if (disputeId) {
                                queryClient.invalidateQueries({queryKey: ['dispute', disputeId]});
                            }
                        } else {
                            invalidateFromNotification(notification, queryClient);
                        }
                    } catch (err) {
                        console.error("Failed to parse notification message", err);
                    }
                })
            },
        });

        stomp.onStompError = (f) => log('STOMP ERROR', f);
        stomp.activate();
        return () => {
            stomp.deactivate();
        };
    }, [userId, token, queryClient, user]);

    return {
        notifications,
        unreadCount,
        isLoadingNotifications: toggleMutation.isPending,
        isLoadingUnreadCount: false,
        markToggle: (id: string, makeRead: boolean) => toggleMutation.mutate({id, makeRead}),
        markAllAsRead: () => markAllMutation.mutate(),
    };
}