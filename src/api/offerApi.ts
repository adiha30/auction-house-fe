/**
 * Offer API module for managing offers on listings.
 * Provides functions to create, accept, reject, withdraw, and fetch offers for listings.
 *
 * @module offerApi
 */

import api from "./axios"

/**
 * Response object for an offer.
 */
export interface OfferResponse {
    offerId: string;
    amount: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    offerorId: string;
    createdAt: string;
}

/**
 * Get all offers for a listing.
 * @param listingId - The listing ID.
 * @returns Promise resolving to an array of OfferResponse objects.
 */
export const getOffers = (listingId: string) =>
    api.get<OfferResponse[]>(`/offers/listing/${listingId}`).then(res => res.data);

/**
 * Create a new offer for a listing.
 * @param listingId - The listing ID.
 * @param amount - The offer amount.
 * @returns Promise resolving to the created OfferResponse object.
 */
export const createOffer = (listingId: string, amount: number) =>
    api.post<OfferResponse>(`/offers`, {listingId, amount}).then(res => res.data);

/**
 * Accept an offer by its ID.
 * @param offerId - The offer ID.
 * @returns Promise resolving when the offer is accepted.
 */
export const acceptOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/accept`);

/**
 * Reject an offer by its ID.
 * @param offerId - The offer ID.
 * @returns Promise resolving when the offer is rejected.
 */
export const rejectOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/reject`);

/**
 * Withdraw an offer by its ID.
 * @param offerId - The offer ID.
 * @returns Promise resolving when the offer is withdrawn.
 */
export const withdrawOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/withdraw`);
