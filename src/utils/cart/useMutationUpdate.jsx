import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdate = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.cart'],
    mutationFn: async (variables) => {
      const { cart_id, ...data } = variables; // ambil cart_id dari variables
      const response = await axiosInstance.put(`${endpoints.cart.update}/${cart_id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
