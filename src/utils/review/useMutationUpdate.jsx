import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateReview = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.review'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.review.update}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
