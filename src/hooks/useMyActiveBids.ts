import {useQuery} from "@tanstack/react-query";
import {getMyActiveBids} from "../api/bidApi.ts";

export const useMyActiveBids = (enabled = true) =>
    useQuery({
        queryKey: ["myActiveBids"],
        enabled: enabled,
        queryFn: () => getMyActiveBids(),
        staleTime: 30_000,
    });