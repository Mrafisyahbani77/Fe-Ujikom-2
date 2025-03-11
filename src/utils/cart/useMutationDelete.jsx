import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDelete = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.cart'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.cart.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
