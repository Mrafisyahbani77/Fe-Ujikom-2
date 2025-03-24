import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDiscountById = (id) =>
  useQuery({
    queryKey: ['discount.id'], // Tambahkan id agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.discount.details}/${id}`);
      return response.data;
    },
    enabled: !!id, // Pastikan query hanya berjalan jika id tersedia
  });
