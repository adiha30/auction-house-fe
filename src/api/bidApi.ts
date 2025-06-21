import api from './axios';
import {Bid} from "../hooks/useBids.ts";

export interface CreateBidPayload {
    listingId: string;
    amount: number;
    buy_now: boolean;
}

export const createBid = (body: CreateBidPayload) =>
    api.post<void | { cause: string }>('/bids', body).then(r => r.data);

export const getMyActiveBids = () =>
    api.get<Bid[]>('/bids/user/active').then(r => r.data);