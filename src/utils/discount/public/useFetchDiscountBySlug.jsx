import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDiscountBySlug = (slug) =>
  useQuery({
    queryKey: ['discount.slug'], // Tambahkan slug agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!slug) return null; // Hindari fetch jika slug tidak tersedia
      const response = await axiosInstance.get(`${endpoints.discount.public.GetDiscountSlug}/${slug}`);
      return response.data;
    },
    enabled: !!slug, // Pastikan query hanya berjalan jika slug tersedia
  });
