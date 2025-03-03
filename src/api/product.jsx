import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetcher(URL),
  });

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsFetching: isFetching,
      productsEmpty: !isLoading && !data?.products?.length,
    }),
    [data?.products, error, isLoading, isFetching]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? `${endpoints.product.details}?productId=${productId}` : null;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => (productId ? fetcher(URL) : Promise.resolve(null)),
    enabled: !!productId, // Query hanya berjalan jika productId ada
  });

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productFetching: isFetching,
    }),
    [data?.product, error, isLoading, isFetching]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? `${endpoints.product.search}?query=${query}` : null;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () => (query ? fetcher(URL) : Promise.resolve(null)),
    enabled: !!query, // Query hanya berjalan jika query ada
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchFetching: isFetching,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isFetching]
  );

  return memoizedValue;
}
