import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateProfile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.profile'],
    mutationFn: async (variables) => {
      const { user_id, data } = variables; 
      const response = await axiosInstance.put(`${endpoints.auth.updateProfile}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
