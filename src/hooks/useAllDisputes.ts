/**
 * Hook for fetching all disputes in the system.
 * Provides functionality to fetch paginated disputes data for admin users.
 */
import { useQuery } from "@tanstack/react-query";
import { getAllDisputes } from "../api/disputeApi";

/**
 * Custom hook that provides functionality to fetch all disputes in the system.
 * @param {number} page - The page number for pagination
 * @param {number} size - The number of items per page
 * @param {boolean} isAdmin - Whether the current user is an admin, controls if query is enabled
 * @returns {Object} Query object with disputes data and query state
 */
export const useAllDisputes = (page: number, size: number, isAdmin: boolean) => {
    return useQuery({
        queryKey: ["disputes", "all", page, size],
        queryFn: () => getAllDisputes(page, size),
        enabled: isAdmin,
    });
};
