import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateWhistlist = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.whistlist'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.whishlist.update}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
