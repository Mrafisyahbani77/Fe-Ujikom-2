import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdatePassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.password'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.auth.updatePassword}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
