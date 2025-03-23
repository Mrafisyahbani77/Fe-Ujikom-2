import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useSearch = (query) => {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['fetch.product', query], // Menambahkan query sebagai dependency
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.product.list}?query=${query}`);
      return response.data.data;
    },
    enabled: !!query, // Hanya fetch jika query ada
  });

  // Menggunakan useMemo untuk mengoptimalkan hasil pencarian
  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [], // Pastikan data tidak undefined
      searchLoading: isLoading,
      searchError: error,
      searchFetching: isFetching,
      searchEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isFetching]
  );

  return memoizedValue;
};
