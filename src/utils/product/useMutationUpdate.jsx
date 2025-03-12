import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdate = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.product'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.product.update}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
