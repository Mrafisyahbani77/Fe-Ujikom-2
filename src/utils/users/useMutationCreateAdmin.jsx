import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateAdmin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.admin'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.user.createAdmin, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
