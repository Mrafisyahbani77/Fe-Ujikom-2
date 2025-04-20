import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllDiscount = () =>
  useQuery({
    queryKey: ['public.discount'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.discount.public.GetAllDiscount);
      console.log(response.data);
      return response.data;
    },
  });
