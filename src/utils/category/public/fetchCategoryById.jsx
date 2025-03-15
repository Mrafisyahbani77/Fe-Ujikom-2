import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const fetchCategoryById = (id) =>
  useQuery({
    queryKey: ['public.category_id'], // Tambahkan id agar cache unik untuk setiap permintaan
    queryFn: async () => {
      if (!id) return null; // Hindari fetch jika id tidak tersedia
      const response = await axiosInstance.get(`${endpoints.public.fetchByIdCategory}/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Pastikan query hanya berjalan jika id tersedia
  });
