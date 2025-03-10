import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdate = ({ onSuccess, onError }, id) =>
  useMutation({
    mutationKey: ['update.category'],
    mutationFn: async (body) => {
      const response = await axiosInstance.put(`${endpoints.category.update}/${id}`, {
        ...body,
        _method: 'PUT',
      });
      return response.data;
    },
    onSuccess,
    onError,
  });
