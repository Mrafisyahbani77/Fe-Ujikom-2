import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllLog = () =>
  useQuery({
    queryKey: ['all.log'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.activityLog.log);
      console.log(response.data);
      return response.data;
    },
  });
