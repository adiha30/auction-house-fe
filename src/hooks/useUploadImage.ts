/**
 * Hook for uploading images to the server.
 * Provides functionality to upload one or multiple images with proper FormData handling.
 */
import {useMutation} from '@tanstack/react-query';
import axios from '../api/axios';

/**
 * Custom hook that provides functionality to upload one or multiple images.
 * Returns an array of image IDs that can be used to reference the uploaded images.
 * @returns {Object} A mutation object with functions to upload images and track mutation state
 */
export const useUploadImage = () =>
    useMutation<string[], unknown, File[]>({
        mutationFn: async (files) => {
            const uploadPromises = files.map(async file => {
                const fd = new FormData();
                fd.append('file', file);

                const response = await axios.post<{ id: string; }>(
                    '/uploads',
                    fd,
                    {headers: {'Content-Type': 'multipart/form-data'}}
                );
                return response.data.id;
            });

            return Promise.all(uploadPromises);
        },
    });
