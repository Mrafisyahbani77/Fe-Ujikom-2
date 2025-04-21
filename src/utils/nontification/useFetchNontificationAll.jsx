import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNontificationAll = () =>
  useQuery({
    queryKey: ['all.nontification'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.nontification.getNontification);
      console.log(response.data);
      return response.data;
    },
  });
