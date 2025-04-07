import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProductAdmin = () =>
  useQuery({
    queryKey: ['fetch.product.admin'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.product.listAdmin);
      console.log(response.data.data);
      return response.data.data;
    },
  });
