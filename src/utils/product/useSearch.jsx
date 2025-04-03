import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useSearch = (query) => {
  const { data, error, isError, isLoading, isFetching } = useQuery({
    queryKey: ['search.product', query],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.product.list}?query=${query}`);
      return response.data.data;
    },
    enabled: !!query,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: Array.isArray(data) ? data : [],
      searchLoading: isLoading,
      searchError: isError ? error?.message || 'Terjadi kesalahan' : null,
      searchFetching: isFetching,
      searchEmpty: !isLoading && (!Array.isArray(data) || data.length === 0),
    }),
    [data, isError, error, isLoading, isFetching]
  );

  return memoizedValue;
};
