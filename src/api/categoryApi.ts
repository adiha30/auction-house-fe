/**
 * Category API module for retrieving categories and their metadata.
 * Provides functions to fetch all categories and to get metadata for a specific category.
 *
 * @module categoryApi
 */

import api from './axios';

/**
 * Category object structure.
 * @property name - The name of the category.
 * @property icon - The icon representing the category.
 */
export interface Category {
    name: string;
    icon: string;
}

/**
 * Metadata for a field required by a category.
 * @property name - The name of the field.
 * @property type - The data type of the field.
 */
export interface FieldMetadata {
    name: string;
    type: 'string' | 'boolean' | 'number' | 'date' | 'enum';
}

/**
 * Metadata for a category, including required fields and minimum bid increment.
 * @property name - The name of the category.
 * @property minBidIncrement - The minimum increment for bids in this category.
 * @property requiredFields - Array of required field metadata for this category.
 */
export interface CategoryMetadata {
    name: string;
    minBidIncrement: number;
    requiredFields: FieldMetadata[];
}

/**
 * Fetch all available categories.
 * @returns Promise resolving to an array of Category objects.
 */
export const getCategories = () =>
    api.get<Category[]>('/categories').then(r => r.data);

/**
 * Fetch metadata for a specific category by name.
 * @param name - The name of the category.
 * @returns Promise resolving to a CategoryMetadata object.
 */
export const getCategoryMetadata = (name: string) =>
    api.get<CategoryMetadata>(`/categories/${name}/metadata`).then(r => r.data);