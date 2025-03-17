import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCategoryBySlug = (slug) =>
  useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      if (!slug) return null; 
      const response = await axiosInstance.get(`${endpoints.category.getBySlug}/${slug}`);
      return response.data.data;
    },
    enabled: !!slug, 
  });
