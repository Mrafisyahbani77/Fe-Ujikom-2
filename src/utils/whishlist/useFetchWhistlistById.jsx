import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchWhistlistById = (id) =>
  useQuery({
    queryKey: ['whistlist', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('WISHLIST ID is required'); 
      }
      const response = await axiosInstance.get(`${endpoints.whishlist.details}/${id}`);
      return response.data ?? null; // ⬅️ Kalau kosong, balikin null aja
    },
    enabled: !!id, // Cuma jalan kalau ada id
  });
