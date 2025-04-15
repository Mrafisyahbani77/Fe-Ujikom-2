import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateInvoice = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.invoice'],
    mutationFn: async ({ data, order_id }) => {
      const response = await axiosInstance.post(
        `${endpoints.order.exportInvoice}/${order_id}/invoice`,
        data
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};
