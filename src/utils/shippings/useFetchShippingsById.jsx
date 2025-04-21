import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchShippingsById = (id) =>
  useQuery({
    queryKey: ['shippings.id', id], // Tambahkan id agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.shippings.details}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
