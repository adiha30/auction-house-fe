/**
 * Hook for receiving real-time bid updates via WebSockets.
 * Establishes a connection to the server's WebSocket endpoint to receive live bid notifications.
 */
import {Client, IMessage} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {useEffect, useRef} from "react";
import {useQueryClient} from "@tanstack/react-query";

/**
 * Interface representing a live bid notification received through WebSockets.
 */
export interface LiveBid {
    listingId: string;
    title: string;
    amount: number;

    bidderId: string;
    username: string;
    firstName: string;
    lastName: string;
}

/**
 * Custom hook that establishes a WebSocket connection to receive live bid notifications.
 * Stores incoming bids in the React Query cache under the "liveBids" key.
 * @returns {void}
 */
export const useLiveBids = (): void => {
    const queryClient = useQueryClient();
    const sockRef = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`${import.meta.env.VITE_API_URL.replace(/\$/, "")}/ws`),
            reconnectDelay: 3000,
            debug: () => {
            },
            onConnect: () => {
                client.subscribe("/topic/live-bids", (m: IMessage) => {
                    try {
                        const bid: LiveBid = JSON.parse(m.body);
                        queryClient.setQueryData<LiveBid[]>(["liveBids"], (old = []) => {
                            const next = [bid, ...old];
                            return next.slice(0, 30);
                        });
                    } catch {/* ignore */
                    }
                });
            },
        });
        client.activate();
        sockRef.current = client;
        return () => {
            void client.deactivate();
        }
    }, [queryClient]);
};
