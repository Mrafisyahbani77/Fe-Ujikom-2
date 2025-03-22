import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDiscount = () =>
  useQuery({
    queryKey: ['fetch.discount'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.discount.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
