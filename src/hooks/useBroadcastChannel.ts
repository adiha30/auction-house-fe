import {useQueryClient} from "@tanstack/react-query";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";
import {Notification} from "./useNotifications.ts";
import {invalidateFromNotification} from "../utils/invalidateMap.ts";
import {useEffect} from "react";

export const useBroadcastChannel = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const log = (...args: any[]) => console.log("[Broadcast WS]", ...args);

        const stompClient = new Client({
            webSocketFactory: () => SockJS(`${import.meta.env.VITE_API_URL}/ws`),
            debug: log,
            reconnectDelay: 5000,
            onConnect: () => {
                log("Connected to broadcast channel");
                stompClient.subscribe('/topic/notifications/broadcast', (message: IMessage) => {
                    try {
                        const notification = JSON.parse(message.body) as Notification;
                        log("Received broadcast message:", notification);

                        invalidateFromNotification(notification, queryClient);
                    } catch (error) {
                        console.error("Failed to parse broadcast message", error);
                    }
                });
            },
            onStompError: (frame) => {
                log("STOMP error:", frame);
            }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [queryClient]);
}