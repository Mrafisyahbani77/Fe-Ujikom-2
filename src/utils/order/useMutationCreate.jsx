import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateOrder = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.order'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.order.create, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
