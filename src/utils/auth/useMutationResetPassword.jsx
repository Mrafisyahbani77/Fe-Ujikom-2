import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationResetPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['reset.password'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        endpoints.auth.resetpassword,
        {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${data.resetToken}`, // Kirim token di header Authorization
          },
        }
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};
