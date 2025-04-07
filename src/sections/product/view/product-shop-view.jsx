import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
// routes
import { paths } from 'src/routes/paths';
// _mock
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from 'src/_mock';
// api
// import { useGetProducts, useSearchProducts } from 'src/api/product';
// components
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import { useCheckoutContext } from '../../checkout/context';
import CartIcon from '../common/cart-icon';
import ProductList from '../product-list';
import ProductSort from '../product-sort';
import ProductSearch from '../product-search';
import ProductFilters from '../product-filters';
import ProductFiltersResult from '../product-filters-result';
import { useFetchProduct } from 'src/utils/product';
import { useSearch } from 'src/utils/product/useSearch';
import { fetchCategory } from 'src/utils/category';

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: '',
  category: 'all',
  priceRange: [0, 0],
};

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('featured');

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const { data: products, isLoading: productsLoading } = useFetchProduct();
  const { data } = fetchCategory();
  const productsEmpty = products.length === 0;

  console.log(products);

  const { searchResults, searchLoading } = useSearch(debouncedQuery);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const dataFiltered = applyFilter({
    inputData: products,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id) => paths.product.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={[...data]}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const renderNotFound = <EmptyContent filled title="Tidak ada data barang" sx={{ py: 10 }} />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      {/* <CartIcon totalItems={checkout.totalItems} /> */}

      {/* <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Shop
      </Typography> */}

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList products={dataFiltered} loading={productsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  console.log('applyFilter - inputData:', inputData);
  console.log('applyFilter - filters:', filters);
  console.log('applyFilter - sortBy:', sortBy);

  if (!Array.isArray(inputData)) {
    console.error('applyFilter - inputData bukan array!', inputData);
    return [];
  }

  let filteredData = [...inputData]; // Salin data agar tidak mengubah aslinya

  const { gender, category, colors, priceRange, rating } = filters;
  console.log(filters);
  const min = priceRange[0];
  const max = priceRange[1];

  if (sortBy === 'featured') {
    filteredData = orderBy(filteredData, ['total_sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    filteredData = orderBy(filteredData, ['created_at'], ['desc']); // ini 'created_at' sesuai API
  }
  if (sortBy === 'priceDesc') {
    filteredData = orderBy(filteredData, [(product) => parseFloat(product.price)], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    filteredData = orderBy(filteredData, [(product) => parseFloat(product.price)], ['asc']);
  }

  // Filtering
  if (gender.length) {
    filteredData = filteredData.filter((product) => gender.includes(product.gender));
  }
  if (category !== 'all') {
    filteredData = filteredData.filter((product) => product?.categories?.name === category);
  }

  if (colors.length) {
    filteredData = filteredData.filter((product) =>
      product?.color?.some((color) => colors.includes(color))
    );
  }

  const minPrice = priceRange[0];
  const maxPrice = priceRange[1];

  // Filtering products based on price range
  if (minPrice !== 0 || maxPrice !== 0) {
    filteredData = filteredData.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  }
  if (rating) {
    filteredData = filteredData.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.total_review > convertRating(rating);
    });
  }

  console.log('applyFilter - filteredData:', filteredData);
  return filteredData;
}
