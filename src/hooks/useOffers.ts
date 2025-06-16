import { useQuery } from "@tanstack/react-query";
import { getOffers, OfferResponse } from "../api/offerApi";

export const useOffers = (listingId: string, enabled = true) =>
    useQuery<OfferResponse[]>({
        queryKey: ["offers", listingId],
        enabled,
        queryFn: () => getOffers(listingId),
        staleTime: 30_000,
    });