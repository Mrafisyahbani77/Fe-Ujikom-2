import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCity = (id) =>
  useQuery({
    queryKey: ['city.id', id],
    queryFn: async () => {
      if (!id) return [];
      const response = await axiosInstance.get(`${endpoints.shippings.city}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // Data tetap fresh selama 30 menit
    cacheTime: 1000 * 60 * 60, // Data tetap di cache selama 1 jam
    placeholderData: [], // Berikan data kosong sebagai placeholder
  });
