import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreate = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.discount'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.discount.create, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
