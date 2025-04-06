import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchOrder = () =>
  useQuery({
    queryKey: ['fetch.order'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.order.list);
      console.log(response.data);
      return response.data;
    },
  });
