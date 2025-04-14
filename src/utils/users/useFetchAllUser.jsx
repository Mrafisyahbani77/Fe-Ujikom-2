import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllUser = () =>
  useQuery({
    queryKey: ['fetch.alluser'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.user.getAllUser);
      console.log(response.data);
      return response.data;
    },
  });
