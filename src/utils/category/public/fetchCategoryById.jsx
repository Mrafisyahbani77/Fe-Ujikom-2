import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const fetchCategoryById = (id) =>
  useQuery({
    queryKey: ['public.category_id'],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`${endpoints.public.fetchByIdCategory}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
