import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchVillage = (id) =>
  useQuery({
    queryKey: ['village.id', id],
    queryFn: async () => {
      if (!id) return [];
      const response = await axiosInstance.get(`${endpoints.shippings.village}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // Data tetap fresh selama 30 menit
    cacheTime: 1000 * 60 * 60, // Data tetap di cache selama 1 jam
    placeholderData: [], // Berikan data kosong sebagai placeholder
  });
