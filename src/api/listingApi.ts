import api from './axios.ts'

export interface ListingSummary {
    listingId: string;
    title: string;
    startPrice: number;
    buyNowPrice: number;
    endTime: string;
    status: 'OPEN' | 'SOLD' | 'CLOSED';
}

export interface ListingDetails extends ListingSummary {
    description: string;
    imageUrl: string;
    category: string;
    seller: { userId: string; username: string };
}

export interface CreateListingPayload {
    title: string;
    description: string;
    category: string;
    startPrice: number;
    buyNowPrice?: number;
    endTime: string;
    images: string[];
}

export const getAllListings = async () => {
    const res = await api.get<ListingSummary[]>('/listings');
    return res.data;
}

export const getListing = (id: string) =>
    api.get<ListingDetails>(`/listings/${id}`).then((res) => res.data);

export const createListing = (body: CreateListingPayload) =>
    api.post('/listings', body).then((res) => res.data);