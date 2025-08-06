/**
 * Utility for invalidating React Query cache based on notifications.
 * This module provides functions to invalidate various queries when notifications are received,
 * ensuring that data displayed to users is always up-to-date.
 */
import {Notification, NotificationType} from "../hooks/useNotifications.ts";
import {QueryClient} from "@tanstack/react-query";

/**
 * Invalidates offers queries for a specific listing.
 *
 * @param queryClient - The React Query client instance
 * @param id - The listing ID to invalidate offers for
 */
const invalidateOffers = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["offers", id]});
}

/**
 * Invalidates bids queries for a specific listing.
 *
 * @param queryClient - The React Query client instance
 * @param id - The listing ID to invalidate bids for
 */
const invalidateBids = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["bids", id]});
}

/**
 * Invalidates a specific listing query.
 *
 * @param queryClient - The React Query client instance
 * @param id - The listing ID to invalidate
 */
const invalidateListing = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["listing", id]});
}

/**
 * Invalidates all listings queries.
 *
 * @param queryClient - The React Query client instance
 */
const invalidateListings = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({queryKey: ["listings"]});
}

/**
 * Invalidates user listings queries.
 *
 * @param queryClient - The React Query client instance
 */
const invalidateUserListings = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({queryKey: ["userListings"]});
}

/**
 * Invalidates all aspects of a listing's details.
 * This includes the listing itself, bids, and offers.
 *
 * @param queryClient - The React Query client instance
 * @param id - The listing ID to invalidate details for
 */
const invalidateListingDetails = (queryClient: QueryClient, id: string) => {
    invalidateListing(queryClient, id);
    invalidateBids(queryClient, id);
    invalidateOffers(queryClient, id);
};

/**
 * Invalidates all listing collections.
 * This includes both general listings and user-specific listings.
 *
 * @param queryClient - The React Query client instance
 */
const invalidateListingLists = (queryClient: QueryClient) => {
    invalidateListings(queryClient);
    invalidateUserListings(queryClient);
}

/**
 * Invalidates a specific dispute query.
 *
 * @param queryClient - The React Query client instance
 * @param id - The dispute ID to invalidate
 */
const invalidateDispute = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["dispute", id]});
}

/**
 * Invalidates all disputes queries.
 *
 * @param queryClient - The React Query client instance
 */
const invalidateDisputes = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({queryKey: ["disputes"]});
}

/**
 * Invalidates appropriate React Query caches based on a notification type.
 * Different notification types require different query invalidations to ensure
 * data consistency throughout the application.
 *
 * @param notification - The notification object that triggered the invalidation
 * @param queryClient - The React Query client instance
 */
export function invalidateFromNotification(
    notification: Notification,
    queryClient: QueryClient
) {
    const {type, listingId} = notification;

    switch (type) {
        case NotificationType.NEW_BID:
        case NotificationType.OUTBID:
            if (listingId) {
                invalidateBids(queryClient, listingId);
                invalidateListing(queryClient, listingId);
                invalidateListingDetails(queryClient, listingId);
            }

            invalidateListings(queryClient);

            break;

        case NotificationType.NEW_OFFER:
        case NotificationType.OFFER_WITHDRAWN:
        case NotificationType.OFFER_REJECTED:
            if (listingId) {
                invalidateOffers(queryClient, listingId);
                invalidateListing(queryClient, listingId);
            }

            break;

        case NotificationType.OFFER_ACCEPTED:
            if (listingId) {
                invalidateOffers(queryClient, listingId);
                invalidateListing(queryClient, listingId);
            }

            invalidateListingLists(queryClient);

            break;

        case NotificationType.AUCTION_ENDED:
        case NotificationType.LISTING_REMOVED_BY_ADMIN:
        case NotificationType.BOUGHT_OUT:
            if (listingId) {
                invalidateListingDetails(queryClient, listingId);
            }

            invalidateListingLists(queryClient);

            break;

        case NotificationType.AUCTION_CREATED:
            invalidateListingLists(queryClient);

            break;

        case NotificationType.DISPUTE_OPENED:
            invalidateDisputes(queryClient);
            break;

        case NotificationType.DISPUTE_CLOSED:
            if (listingId) {
                invalidateDispute(queryClient, listingId);
            }
            invalidateDisputes(queryClient);
            break;

        case NotificationType.WATCHED_CHANGE:
        default:
            break;
    }
}