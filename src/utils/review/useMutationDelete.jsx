import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteReview = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.review'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.review.delete}/${id}`);
      return response;
    },
    onError,
    onSuccess,
  });
};
