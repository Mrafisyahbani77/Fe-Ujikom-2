import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCategoryBySlug = (slug) =>
  useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      // if (!slug) return null;
      const response = await axiosInstance.get(`${endpoints.category.getBySlug}/${slug}`);
      return response.data.data;
      console.log(response.data.data)
    },
    enabled: !!slug,
  });
