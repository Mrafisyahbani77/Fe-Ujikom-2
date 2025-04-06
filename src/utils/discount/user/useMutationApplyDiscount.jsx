import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationApplyDiscount = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['apply.discount'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.discount.user.checkValidate, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
