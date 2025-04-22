import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CartIcon from '../common/cart-icon';
import ProductDetailsReview from '../product-details-review';
import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';
import { useCheckoutContext } from '../../checkout/context';
import { useFetchProduct, useFetchProductById } from 'src/utils/product';
import { usefetchReviewPublicById } from 'src/utils/review';

// ----------------------------------------------------------------------

export default function ProductShopDetailsView({ id }) {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState('description');

  const { data, isLoading: productLoading, isError: productError } = useFetchProductById(id);
  const {
    data: review,
    isLoading: reviewLoading,
    isError: reviewError,
  } = usefetchReviewPublicById(id);
  console.log(review);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${productError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Kembali
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = data && (
    <>
      <CustomBreadcrumbs
        links={[{ name: 'Beranda', href: '/' }, { name: data?.name }]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={data} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary
            product={data}
            items={checkout.items}
            onAddCart={checkout.onAddToCart}
            onGotoStep={checkout.onGotoStep}
          />
        </Grid>
      </Grid>

      {/* <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        <Box key={data.name} sx={{ textAlign: 'center', px: 5 }}>
          <Iconify icon={data.icon} width={32} sx={{ color: 'primary.main' }} />

          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            {data.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              '& p': {
                margin: 0,
                display: 'inline',
              },
            }}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </Box>
      </Box> */}

      <Card sx={{ mt: 10 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Deskripsi',
            },
            {
              value: 'reviews',
              label: `Review (${review?.reviews.length})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={data?.description} data={data} />
        )}

        {currentTab === 'reviews' && (
          <ProductDetailsReview
            data={data.id}
            ratings={review.rating}
            reviews={review?.reviews}
            totalRatings={data?.review?.average_rating}
            totalReviews={data?.review?.total_review}
          />
        )}
      </Card>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mt: 5,
        mb: 15,
      }}
    >
      {/* <CartIcon totalItems={checkout.totalItems} /> */}

      {productLoading && renderSkeleton}

      {productError && renderError}

      {data && renderProduct}
    </Container>
  );
}

ProductShopDetailsView.propTypes = {
  id: PropTypes.string,
};
