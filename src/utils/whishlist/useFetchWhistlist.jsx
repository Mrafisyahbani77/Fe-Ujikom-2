import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchWhislist = () =>
  useQuery({
    queryKey: ['fetch.whishlist'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.whishlist.list);
      console.log(response.data);
      return response.data;
    },
  });
