import axios from "./axios.ts"

export enum DisputeReason {
    ITEM_NOT_AS_DESCRIBED = 'Item not as described',
    ITEM_NOT_RECEIVED = 'Item not received',
    FRAUDULENT_SELLER = 'Fraudulent seller',
    OTHER = 'Other'
}

export enum DisputeStatus {
    OPEN = 'OPEN',
    AWAITING_FOR_DECISION = 'AWAITING_FOR_DECISION',
    CLOSED = 'CLOSED'
}

export interface DisputeMessage {
    messageId: string;
    disputeId: string;
    senderId: string;
    message: string;
    createdAt: string;
}

export interface Dispute {
    disputeId: string;
    listingId: string;
    winnerId: string;
    sellerId: string;
    reason: string;
    details: string;
    status: DisputeStatus;
    disputeMessages: DisputeMessage[];
    createdAt: string;
}

export interface PaginatedDisputes {
    content: Dispute[];
    totalPages: number;
    totalElements: number;
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

export const getAllDisputes = async (page: number, size: number): Promise<PaginatedDisputes> => {
    const response = await axios.get<PaginatedDisputes>('/disputes', {
        params: {page, size},
    });
    return response.data;
};

export const getMyDisputes = async (userId: string, page: number, size: number): Promise<PaginatedDisputes> => {
    const response = await axios.get<Dispute[]>(`/disputes/user/${userId}`, {
        params: {
            page,
            size
        }
    });
    const disputes = response.data;
    // Since the API returns an array, we'll construct the paginated response.
    // We can guess the total pages for basic pagination.
    const totalPages = disputes.length < size ? page + 1 : page + 2;

    return {
        content: disputes,
        totalPages: totalPages,
        totalElements: disputes.length,
    };
};

export const addDisputeMessage = async (disputeId: string, message: string, senderId: string): Promise<void> =>
    await axios.post(`/disputes/${disputeId}/message`, {disputeId, message, senderId});

export const updateDisputeStatus = async (disputeId: string, status: string): Promise<string> => {
    const response = await axios.put<string>(`/disputes/${disputeId}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const checkDisputeExists = async (listingId: string): Promise<string | null> => {
    try {
        const response = await axios.get<string | null>(`/disputes/${listingId}/exists`);

        return response.data || null;
    } catch (error) {
        console.error(`Error checking dispute existence for listing ${listingId}:`, error);

        return null;
    }
}