import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteWhislist = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.whistlist'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.whishlist.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
