import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchReviewById = (id) =>
  useQuery({
    queryKey: ['review.id', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`${endpoints.review.details}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
