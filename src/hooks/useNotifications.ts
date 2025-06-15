import axios from "../api/axios.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {enqueueSnackbar} from "notistack";
import {useEffect} from "react";
import {Client, IMessage} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {invalidateFromNotification} from "../utils/invalidateMap.ts";

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
    WATCHED_CHANGE = "WATCHED_CHANGE"
}

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

const fetchNotifications = async () =>
    (await axios.get<Notification[]>("/notifications")).data;

const fetchUnreadCount = async () =>
    (await axios.get<{ unread: number }>("/notifications/count")).data.unread;

const markRead = (id: string) => axios.post(`/notifications/${id}/read`).then(() => {
});
const markUnread = (id: string) => axios.post(`/notifications/${id}/unread`).then(() => {
});

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

            console.info(prevNotifs);

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

    useEffect(() => {
        const log = (...a: any[]) => console.info("[WS]", ...a);

        if (!userId || !token) return;

        const stomp = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL.replace(/\$/, "")}/ws`),
            debug: log,
            reconnectDelay: 0,
            onConnect: () => {
                log("CONNECTED");
                stomp.subscribe(`/topic/notifications/${userId}`, (m: IMessage) => {
                    try {
                        const notification = JSON.parse(m.body) as Notification;
                        enqueueSnackbar(notification.text, {
                            variant: "info",
                            anchorOrigin: {vertical: "bottom", horizontal: "left"},
                        });
                        queryClient.setQueryData<Notification[]>(["notifications", userId], (old = []) => [notification, ...old]);
                        queryClient.setQueryData(
                            ["unreadCount", userId],
                            (old: number = 0) => old + 1
                        )

                        invalidateFromNotification(notification, queryClient);
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
    }, [userId, token, queryClient]);

    return {
        notifications,
        unreadCount,
        isLoadingNotifications: toggleMutation.isPending,
        isLoadingUnreadCount: false,
        markToggle: (id: string, makeRead: boolean) => toggleMutation.mutate({id, makeRead}),
        markAllAsRead: () => markAllMutation.mutate(),
    };
}
