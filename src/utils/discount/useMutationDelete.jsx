import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDelete = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.discount'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.discount.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
