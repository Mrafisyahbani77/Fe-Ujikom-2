import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationReadAll = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['read.all'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.nontification.updateNontificationReadAll}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
