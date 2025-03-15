import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCartById = (id) =>
  useQuery({
    queryKey: ['cart.id'],
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.cart.details}/${id}`);
      return response.data;
    },
    enabled: !!id, 
  });
