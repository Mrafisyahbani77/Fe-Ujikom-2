import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUnban = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['unban'],
    mutationFn: async ({ id }) => {
      const response = await axiosInstance.put(`${endpoints.user.unbanUser}/${id}/unban`);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
