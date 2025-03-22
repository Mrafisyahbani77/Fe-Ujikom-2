import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDiscountBySlug = (slug) =>
  useQuery({
    queryKey: ['discount'],
    queryFn: async () => {
      if (!slug) return null; 
      const response = await axiosInstance.get(`${endpoints.discount.getBySlug}/${slug}`);
      return response.data.data;
    },
    enabled: !!slug, 
  });
