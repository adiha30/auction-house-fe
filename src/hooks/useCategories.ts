import { useQuery } from '@tanstack/react-query';
import { getCategories, Category } from '../api/categoryApi';

export const useCategories = () =>
    useQuery<Category[]>({ queryKey: ['categories'], queryFn: getCategories });