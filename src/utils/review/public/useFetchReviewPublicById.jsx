import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usefetchReviewPublicById = (id) =>
  useQuery({
    queryKey: ['public.review_id'],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`${endpoints.review.public.details}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
