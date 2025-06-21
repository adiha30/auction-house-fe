import api from './axios';
import {ActiveBid} from "../hooks/useBids.ts";

export interface CreateBidPayload {
    listingId: string;
    amount: number;
    buy_now: boolean;
}

export const createBid = (body: CreateBidPayload) =>
    api.post<void | { cause: string }>('/bids', body).then(r => r.data);

export const getMyActiveBids = () =>
    api.get<ActiveBid[]>('/bids/user/active').then(r => r.data);