import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchVillage = (id) =>
  useQuery({
    queryKey: ['village.id', id], // Tambahkan id agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.shippings.village}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
