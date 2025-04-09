import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchOrderById = (id) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Order ID is required'); // ⬅️ Biar jelas errornya
      }
      const response = await axiosInstance.get(`${endpoints.order.details}/${id}`);
      return response.data ?? null; // ⬅️ Kalau kosong, balikin null aja
    },
    enabled: !!id, // Cuma jalan kalau ada id
  });
