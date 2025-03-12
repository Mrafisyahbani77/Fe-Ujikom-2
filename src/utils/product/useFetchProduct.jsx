import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProduct = () =>
  useQuery({
    queryKey: ['fetch.product'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.product.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
