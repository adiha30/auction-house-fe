import { useMutation } from '@tanstack/react-query';
import axios from '../api/axios';

export const useUploadImage = () =>
    useMutation<string[], unknown, File[]>({
        mutationFn: async (files) => {
            const uploadPromises = files.map(async file => {
                const fd = new FormData();
                fd.append('file', file);

                const response = await axios.post<{ url: string; }>(
                    '/uploads',
                    fd,
                    {headers: {'Content-Type': 'multipart/form-data'}}
                );
                return response.data.url;
            });

            return Promise.all(uploadPromises);
        },
    });
