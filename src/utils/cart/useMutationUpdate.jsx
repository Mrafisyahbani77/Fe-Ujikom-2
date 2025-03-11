import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdate = ({ onSuccess, onError }, id) => {
  return useMutation({
    mutationKey: ['edit.cart'],
    mutationFn: async (data) => {
      const response = await axiosInstance.put(`${endpoints.cart.update}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
