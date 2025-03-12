import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchChartWeekly = () =>
  useQuery({
    queryKey: ['chart.weekly'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.sale_weekly);
      console.log(response.data);
      return response.data;
    },
  });
