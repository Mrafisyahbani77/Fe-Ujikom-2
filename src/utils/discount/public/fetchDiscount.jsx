import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const fetchDiscount = () =>
  useQuery({
    queryKey: ['public.discount'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.public.fetchAllDiscount);
      console.log(response.data.data);
      return response.data.data;
    },
  });
