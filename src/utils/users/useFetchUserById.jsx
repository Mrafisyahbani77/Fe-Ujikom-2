import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchUserById = (id) =>
  useQuery({
    queryKey: ['user.id', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`${endpoints.user.getById}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
