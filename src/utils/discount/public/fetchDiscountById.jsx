import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const fetchDiscountById = (id) =>
  useQuery({
    queryKey: ['public.discount_id'],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`${endpoints.public.fetchByIdDiscount}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
