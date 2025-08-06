/**
 * Hook for handling WebSocket broadcast channel communications.
 * Sets up a connection to the server's WebSocket endpoint to receive broadcast notifications.
 */
import {useQueryClient} from "@tanstack/react-query";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";
import {Notification} from "./useNotifications.ts";
import {invalidateFromNotification} from "../utils/invalidateMap.ts";
import {useEffect} from "react";

/**
 * Custom hook that sets up a WebSocket connection to receive broadcast notifications.
 * Handles connecting to the WebSocket server, subscribing to broadcast topics,
 * and invalidating relevant queries when notifications are received.
 * @returns {void}
 */
export const useBroadcastChannel = (): void => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const log = (...args: any[]) => console.log("[Broadcast WS]", ...args);

        const stompClient = new Client({
            webSocketFactory: () => SockJS(`${import.meta.env.VITE_API_URL}/ws`),
            debug: log,
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe('/topic/notifications/broadcast', (message: IMessage) => {
                    try {
                        const notification = JSON.parse(message.body) as Notification;

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