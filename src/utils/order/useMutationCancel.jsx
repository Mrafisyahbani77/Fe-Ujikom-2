import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCancel = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.order'],
    mutationFn: async ({ id, reason }) => {
      const response = await axiosInstance.post(
        `${endpoints.order.cancel}/${id}/request-cancellation`,
        { reason }
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};
