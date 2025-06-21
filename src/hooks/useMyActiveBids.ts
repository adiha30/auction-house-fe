import {useQuery} from "@tanstack/react-query";
import {Bid} from "./useBids.ts";
import {getMyActiveBids} from "../api/bidApi.ts";

export const useMyActiveBids = (enabled = true) =>
    useQuery<Bid[]>({
        queryKey: ["myActiveBids"],
        enabled,
        queryFn: () => getMyActiveBids(),
        staleTime: 30_000,
    });