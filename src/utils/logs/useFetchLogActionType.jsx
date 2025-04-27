import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchLogActionType = () =>
  useQuery({
    queryKey: ['log.action.type'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.activityLog.actionType);
      console.log(response.data);
      return response.data;
    },
  });
