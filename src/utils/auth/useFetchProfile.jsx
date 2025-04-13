import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProfile = () =>
  useQuery({
    queryKey: ['fetch.profile'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.auth.me);
      console.log(response.data);
      return response.data;
    },
  });
