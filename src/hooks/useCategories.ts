import {useQuery} from '@tanstack/react-query';
import {Category, getCategories} from '../api/categoryApi';

export const useCategories = () =>
    useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 30_000,
    });