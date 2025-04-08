import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useSearchCategory = (query, category) => {
  const enabled = Boolean(query);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['searchProducts', query, category], // Tambahkan category ke queryKey
    queryFn: () =>
      axiosInstance
        .get(endpoints.product.list, {
          params: {
            query,
            category, // Tambahkan category ke params
          },
        })
        .then((res) => res.data.data),
    enabled, // hanya jalan kalau query ada
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(() => {
    const results = Array.isArray(data) ? data : [];

    const filteredResults = results.filter((product) => {
      if (!category) return true;

      const cat = product.categories;
      return cat && cat.name?.toLowerCase() === category.toLowerCase();
    });

    console.log(filteredResults);

    return {
      searchResults: filteredResults,
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isFetching,
      searchEmpty: !isLoading && filteredResults.length === 0,
    };
  }, [data, error, isLoading, isFetching, category]);

  return memoizedValue;
};
