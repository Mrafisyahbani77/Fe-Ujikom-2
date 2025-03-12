import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchChartOrder = () =>
  useQuery({
    queryKey: ['chart.order'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.total_order);
      console.log(response.data);
      return response.data;
    },
  });
