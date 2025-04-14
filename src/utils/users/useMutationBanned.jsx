import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationBanned = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.order'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.user.banUser}/${id}/ban`, {data});
      return response.data;
    },
    onSuccess,
    onError,
  });
};
