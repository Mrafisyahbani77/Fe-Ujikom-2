import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNewProduct = () =>
  useQuery({
    queryKey: ['fetch.newproduct'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.product.chartNew);
      console.log(response.data.data);
      return response.data.data;
    },
  });
