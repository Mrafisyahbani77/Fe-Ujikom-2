import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const fetchCategory = () =>
  useQuery({
    queryKey: ['public.category'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.public.fetchAllCategory);
      console.log(response.data.data);
      return response.data.data;
    },
  });
