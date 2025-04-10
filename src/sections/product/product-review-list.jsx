import PropTypes from 'prop-types';
// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import ProductReviewItem from './product-review-item';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ProductReviewList({ reviews }) {
  console.log(reviews);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // <<-- jumlah data per halaman

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Potong data sesuai halaman
  // const paginatedReviews = reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      {reviews?.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={Math.ceil(reviews.length / itemsPerPage)} // <-- ini dinamis
        page={page}
        onChange={handleChangePage} // <-- ganti halaman
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}

ProductReviewList.propTypes = {
  reviews: PropTypes.array,
};
