import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useSearch = (query) => {
  const enabled = Boolean(query);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () =>
      axiosInstance.get(endpoints.product.list, { params: { query } }).then((res) => res.data.data),
    enabled, // hanya jalan kalau query ada
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: Array.isArray(data) ? data : [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isFetching,
      searchEmpty: !isLoading && (!Array.isArray(data) || data.length === 0),
    }),
    [data, error, isLoading, isFetching]
  );

  return memoizedValue;
};
