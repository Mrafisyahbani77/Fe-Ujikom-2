import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateShippings = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.shippings'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.shippings.create, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
