import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateWhislist = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.whistlist'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.whishlist.create, data);
      return response.data; // Ambil response.data langsung!
    },
    onSuccess,
    onError,
  });
};
