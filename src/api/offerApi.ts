import api from "./axios"

export interface OfferResponse {
    offerId: string;
    amount: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    offerorId: string;
    createdAt: string;
}

export const getOffers = (listingId: string) =>
    api.get<OfferResponse[]>(`/offers/listing/${listingId}`).then(res => res.data);

export const createOffer = (listingId: string, amount: number) =>
    api.post<OfferResponse>(`/offers`, {listingId, amount}).then(res => res.data);

export const acceptOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/accept`);

export const rejectOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/reject`);

export const withdrawOffer = (offerId: string) =>
    api.post<void>(`/offers/${offerId}/withdraw`);