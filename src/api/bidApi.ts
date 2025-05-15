import api from './axios';

export interface CreateBidPayload {
    listingId: string;
    amount: number;
    buy_now: boolean;
}

export const createBid = (body: CreateBidPayload) =>
    api.post<void | { cause: string }>('/bids', body).then(r => r.data);