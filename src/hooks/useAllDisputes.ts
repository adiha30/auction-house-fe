import { useQuery } from "@tanstack/react-query";
import { getAllDisputes } from "../api/disputeApi";

export const useAllDisputes = (page: number, size: number, isAdmin: boolean) => {
    return useQuery({
        queryKey: ["disputes", "all", page, size],
        queryFn: () => getAllDisputes(page, size),
        enabled: isAdmin,
    });
};

