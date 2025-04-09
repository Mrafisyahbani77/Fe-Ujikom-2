import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchReview = () =>
  useQuery({
    queryKey: ['fetch.review'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.review.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
