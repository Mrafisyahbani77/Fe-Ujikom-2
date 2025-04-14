import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchTotalUser = () =>
  useQuery({
    queryKey: ['chart.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.total_user);
      console.log(response.data);
      return response.data;
    },
  });
