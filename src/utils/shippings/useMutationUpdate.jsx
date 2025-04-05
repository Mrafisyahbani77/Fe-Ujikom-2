import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateShippings = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.shippings'],
    mutationFn: async ({ data, id }) => {
      const response = await axiosInstance.put(`${endpoints.shippings.update}/${id}`, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
