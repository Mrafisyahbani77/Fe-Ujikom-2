import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchBanner = () =>
  useQuery({
    queryKey: ['public.banner'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.banner.public.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
