import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteShippings = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.shippings'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.shippings.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
