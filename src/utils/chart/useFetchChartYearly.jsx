import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchChartYearly = () =>
  useQuery({
    queryKey: ['chart.yearly'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.sales_yearly);
      console.log(response.data);
      return response.data;
    },
  });
