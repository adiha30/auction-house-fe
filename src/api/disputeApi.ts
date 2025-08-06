/**
 * Dispute API module for managing disputes between users.
 * Provides functions to create disputes, fetch disputes, add messages, and update dispute status.
 *
 * @module disputeApi
 */

import axios from "./axios.ts"

/**
 * Enum of possible dispute reasons.
 */
export enum DisputeReason {
    ITEM_NOT_AS_DESCRIBED = 'Item not as described',
    ITEM_NOT_RECEIVED = 'Item not received',
    FRAUDULENT_SELLER = 'Fraudulent seller',
    OTHER = 'Other'
}

/**
 * Enum of possible dispute statuses.
 */
export enum DisputeStatus {
    OPEN = 'OPEN',
    AWAITING_FOR_DECISION = 'AWAITING_FOR_DECISION',
    CLOSED = 'CLOSED'
}

/**
 * Represents a message in a dispute conversation.
 */
export interface DisputeMessage {
    messageId: string;
    disputeId: string;
    senderId: string;
    message: string;
    createdAt: string;
}

/**
 * Represents a dispute between users.
 */
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

/**
 * Paginated response for disputes.
 */
export interface PaginatedDisputes {
    content: Dispute[];
    totalPages: number;
    totalElements: number;
}

/**
 * Request payload for creating a dispute.
 */
export interface CreateDisputeRequest {
    listingId: string;
    winnerId: string;
    sellerId: string;
    reason: DisputeReason;
    details?: string;
}

/**
 * Create a new dispute.
 * @param request - The dispute creation payload.
 * @returns Promise resolving to the created dispute ID.
 */
export const createDispute = async (request: CreateDisputeRequest): Promise<string> => {
    const response = await axios.post<string>(`/disputes/create`, request);

    return response.data;
}

/**
 * Get a dispute by its ID.
 * @param disputeId - The ID of the dispute.
 * @returns Promise resolving to the Dispute object.
 */
export const getDispute = async (disputeId: string): Promise<Dispute> => {
    const response = await axios.get<Dispute>(`/disputes/${disputeId}`);

    return response.data;
}

/**
 * Get all disputes (paginated).
 * @param page - Page number.
 * @param size - Page size.
 * @returns Promise resolving to a paginated list of disputes.
 */
export const getAllDisputes = async (page: number, size: number): Promise<PaginatedDisputes> => {
    const response = await axios.get<PaginatedDisputes>('/disputes', {
        params: {page, size},
    });
    return response.data;
};

/**
 * Get all disputes for a specific user (paginated).
 * @param userId - The user ID.
 * @param page - Page number.
 * @param size - Page size.
 * @returns Promise resolving to a paginated list of disputes for the user.
 */
export const getMyDisputes = async (userId: string, page: number, size: number): Promise<PaginatedDisputes> => {
    const response = await axios.get<Dispute[]>(`/disputes/user/${userId}`, {
        params: {
            page,
            size
        }
    });
    const disputes = response.data;
    const totalPages = disputes.length < size ? page + 1 : page + 2;

    return {
        content: disputes,
        totalPages: totalPages,
        totalElements: disputes.length,
    };
};

/**
 * Add a message to a dispute.
 * @param disputeId - The dispute ID.
 * @param message - The message content.
 * @param senderId - The sender's user ID.
 * @returns Promise resolving when the message is added.
 */
export const addDisputeMessage = async (disputeId: string, message: string, senderId: string): Promise<void> =>
    await axios.post(`/disputes/${disputeId}/message`, {disputeId, message, senderId});

/**
 * Update the status of a dispute.
 * @param disputeId - The dispute ID.
 * @param status - The new status.
 * @returns Promise resolving to the updated status string.
 */
export const updateDisputeStatus = async (disputeId: string, status: string): Promise<string> => {
    const response = await axios.put<string>(`/disputes/${disputeId}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

/**
 * Check if a dispute exists for a listing.
 * @param listingId - The listing ID.
 * @returns Promise resolving to the dispute ID if exists, or null.
 */
export const checkDisputeExists = async (listingId: string): Promise<string | null> => {
    try {
        const response = await axios.get<string | null>(`/disputes/${listingId}/exists`);

        return response.data || null;
    } catch (error) {
        console.error(`Error checking dispute existence for listing ${listingId}:`, error);

        return null;
    }
}