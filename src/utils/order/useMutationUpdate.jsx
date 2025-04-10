import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateOrderStatus = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.order'],
    mutationFn: async ({ status, id }) => {
      const response = await axiosInstance.put(`${endpoints.order.update}/${id}/status`, {status});
      return response.data;
    },
    onSuccess,
    onError,
  });
};
