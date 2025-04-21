import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationReadById = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['read.id'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.nontification.updateNontificationById}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
