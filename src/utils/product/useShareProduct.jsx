import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useShareProduct = (id) =>
  useQuery({
    queryKey: ['share.product.id', id], // Tambahkan id agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.product.shareProduct}/${id}`);
      return response.data;
    },
    enabled: !!id, // Pastikan query hanya berjalan jika id tersedia
  });


