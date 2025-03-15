import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCart = (userId) =>
  useQuery({
    queryKey: ['fetch.cart', userId],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.cart.list);
      console.log(response.data);
      return response.data;
    },
    enabled: !!userId, // Hanya fetch jika userId ada
  });
