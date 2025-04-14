import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationForgotPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['forgot.password'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.auth.forgotpassword, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
