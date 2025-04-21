import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchUnreadNontification = () =>
  useQuery({
    queryKey: ['unread.nontification'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.nontification.getUnReadNontification);
      console.log(response.data);
      return response.data;
    },
  });
