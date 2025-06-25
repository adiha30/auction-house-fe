import api from './axios';
import {ActiveBid} from "../hooks/useBids.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

export interface CreateBidPayload {
    listingId: string;
    amount: number;
    buy_now: boolean;
}

export const createBid = (body: CreateBidPayload) =>
    api.post<void | { cause: string }>('/bids', body).then(r => r.data);

export const getMyActiveBids = async (): Promise<ActiveBid[]> => {
    const res = await api.get<ActiveBid[]>('/bids/user/active');
    return res.data.map(activeBid => ({
        ...activeBid,
        imageIds: resolveImageUrls(activeBid.imageIds)
    }));
}