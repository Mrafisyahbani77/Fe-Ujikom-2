import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import ProductItem from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

export default function ProductList({ products, loading, ...other }) {
  const [page, setPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const itemsPerPage = 5;
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

  useEffect(() => {
    if (products) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedProducts(products.slice(startIndex, endIndex));
    }
  }, [page, products]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Scroll to top of the product list when page changes (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSkeleton = (
    <>
      {[...Array(itemsPerPage)].map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {displayedProducts?.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {products?.length > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

ProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
};
