import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationLogout = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['auth.logout'],
    mutationFn: async () => {
      const token_refresh = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post(endpoints.auth.logout, {
        refreshToken: token_refresh,
      });
      localStorage.clear('accessToken');
      localStorage.clear('refreshToken');
      return response.data;
    },
    onSuccess,
    onError,
  });
