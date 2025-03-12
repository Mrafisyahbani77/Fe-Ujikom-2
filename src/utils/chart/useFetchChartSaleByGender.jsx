import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchChartSaleByGender = () =>
  useQuery({
    queryKey: ['chart.bygender'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.sales_by_gender);
      console.log(response.data);
      return response.data;
    },
  });
