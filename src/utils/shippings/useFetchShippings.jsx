import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchShippings = () =>
  useQuery({
    queryKey: ['fetch.shippings'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.shippings.list);
      console.log(response.data.data);
      return response.data.data;
    },
  });
