import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationVerifyOtp = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['verify.otp'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.auth.verifyotp, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
