import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchTotalProducts = () =>
  useQuery({
    queryKey: ['chart.products'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.total_produk);
      console.log(response.data);
      return response.data;
    },
  });
