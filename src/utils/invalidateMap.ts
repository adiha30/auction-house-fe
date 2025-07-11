import {Notification, NotificationType} from "../hooks/useNotifications.ts";
import {QueryClient} from "@tanstack/react-query";


const invalidateOffers = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["offers", id]});
}
const invalidateBids = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["bids", id]});
}
const invalidateListing = (queryClient: QueryClient, id: string) => {
    queryClient.invalidateQueries({queryKey: ["listing", id]});
}
const invalidateListings = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({queryKey: ["listings"]});
}
const invalidateUserListings = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({queryKey: ["userListings"]});
}
const invalidateListingDetails = (queryClient: QueryClient, id: string) => {
    invalidateListing(queryClient, id);
    invalidateBids(queryClient, id);
    invalidateOffers(queryClient, id);
};

const invalidateListingLists = (queryClient: QueryClient) => {
    invalidateListings(queryClient);
    invalidateUserListings(queryClient);
}

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
        case NotificationType.WATCHED_CHANGE:
        default:
            break;
    }
}