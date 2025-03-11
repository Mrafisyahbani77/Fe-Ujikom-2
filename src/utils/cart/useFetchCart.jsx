import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchCart = () =>
  useQuery({
    queryKey: ['fetch.cart'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.cart.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
