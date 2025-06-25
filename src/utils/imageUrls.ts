import {API_URL} from "../api/config.ts";
import {uploadsPath} from "../api/listingApi.ts";

export const resolveImageUrl = (id: string): string =>
    id.startsWith('http') ? id : `${API_URL}${uploadsPath}/${id}`;


export const resolveImageUrls = (ids: (string | undefined | null)[] = []): string[] =>
    ids.filter(Boolean).map(id => resolveImageUrl(String(id)));