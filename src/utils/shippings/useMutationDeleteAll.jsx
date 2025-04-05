import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteAll = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.category'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.shippings.deleteAll}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
