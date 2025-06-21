import {useQuery} from "@tanstack/react-query";
import {ActiveBid} from "./useBids.ts";
import {getMyActiveBids} from "../api/bidApi.ts";

export const useMyActiveBids = (enabled = true) =>
    useQuery<ActiveBid[]>({
        queryKey: ["myActiveBids"],
        enabled,
        queryFn: () => getMyActiveBids(),
        staleTime: 30_000,
    });