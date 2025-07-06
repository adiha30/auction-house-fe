import axios from "./axios.ts"

export enum DisputeReason {
    ITEM_NOT_AS_DESCRIBED = 'Item not as described',
    ITEM_NOT_RECEIVED = 'Item not received',
    FRAUDLENT_SELLER = 'Fraudulent seller',
    OTHER = 'Other'
}

export enum DisputeStatus {
    OPEN = 'OPEN',
    AWAITING_FOR_DECISION = 'AWAITING_FOR_DECISION',
    CLOSED = 'CLOSED'
}

export interface Dispute {
    disputeId: string;
    listingId: string;
    winnerId: string;
    sellerId: string;
    reason: string;
    details: string;
    status: DisputeStatus;
}

export interface CreateDisputeRequest {
    listingId: string;
    winnerId: string;
    sellerId: string;
    reason: DisputeReason;
    details?: string;
}

export const createDispute = async (request: CreateDisputeRequest): Promise<string> => {
    const response = await axios.post<string>(`/disputes/create`, request);

    return response.data;
}

export const getDispute = async (disputeId: string): Promise<Dispute> => {
    const response = await axios.get<Dispute>(`/disputes/${disputeId}`);

    return response.data;
}