import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGoogle = () => {
  return useQuery({
    queryKey: ['google'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.auth.google);
      return response.data;
    },
    enabled: false, // Tidak dijalankan otomatis saat komponen dirender
  });
};
