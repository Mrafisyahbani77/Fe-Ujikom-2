import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProvinces = () =>
  useQuery({
    queryKey: ['fetch.provinces'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.shippings.provinces);
      console.log(response.data.data);
      return response.data.data;
    },
  });
