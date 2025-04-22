import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProvinces = () =>
  useQuery({
    queryKey: ['fetch.provinces'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.shippings.provinces);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // Data tetap fresh selama 30 menit
    cacheTime: 1000 * 60 * 60, // Data tetap di cache selama 1 jam
  });
