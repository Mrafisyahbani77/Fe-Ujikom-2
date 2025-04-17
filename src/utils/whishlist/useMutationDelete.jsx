import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteWhislist = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.whistlist'],
    mutationFn: async (wishlistId) => {
      const response = await axiosInstance.delete(`${endpoints.whishlist.delete}/${wishlistId}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
