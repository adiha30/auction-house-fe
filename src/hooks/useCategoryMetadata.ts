import {useQuery} from '@tanstack/react-query';
import {CategoryMetadata, getCategoryMetadata} from '../api/categoryApi';

export const useCategoryMetadata = (name?: string) =>
    useQuery<CategoryMetadata>({
        queryKey: ['categoryMeta', name],
        queryFn: () => getCategoryMetadata(name!),
        enabled: !!name,
    });