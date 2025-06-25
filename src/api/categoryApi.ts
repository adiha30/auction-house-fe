import api from './axios';

export interface Category {
    name: string;
    icon: string;
}

export interface FieldMetadata {
    name: string;
    type: 'string' | 'boolean' | 'number' | 'date' | 'enum';
    options?: string[];
    min?: number;
    max?: number;
}

export interface CategoryMetadata {
    name: string;
    minBidIncrement: number;
    requiredFields: FieldMetadata[];
}

export const getCategories = () =>
    api.get<Category[]>('/categories').then(r => r.data);

export const getCategoryMetadata = (name: string) =>
    api.get<CategoryMetadata>(`/categories/${name}/metadata`).then(r => r.data);