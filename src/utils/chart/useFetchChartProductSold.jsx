import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchChartProductSold = () =>
  useQuery({
    queryKey: ['chart.sold'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.products_sold);
      console.log(response.data);
      return response.data;
    },
  });
