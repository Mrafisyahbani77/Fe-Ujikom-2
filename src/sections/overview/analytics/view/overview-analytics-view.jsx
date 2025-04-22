// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _ecommerceLatestProducts,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

import {
  useFetchChartWeekly,
  useFetchChartOrder,
  useFetchChartProductSold,
  useFetchChartSaleByGender,
  useFetchChartYearly,
  useFetchTotalUser,
  useFetchTotalProducts,
  useFetchNewProduct,
} from 'src/utils/chart';
import { useMemo } from 'react';
import { SeoIllustration } from 'src/assets/illustrations';
import { Button } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceLatestProducts from '../ecommerce-latest-products';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import AppWelcome from '../app-welcome';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const users = user.data;
  // console.log(users)
  const theme = useTheme();
  const { data = [], isLoading, isError } = useFetchChartWeekly();
  const { data: total_order, isLoading: load, isError: error } = useFetchChartOrder();
  const { data: soldData = [], isLoading: loading, isError: Error } = useFetchChartProductSold();
  const {
    data: genderData = [],
    isLoading: fetching,
    isError: not_work,
  } = useFetchChartSaleByGender();
  const { data: year, isLoading: isloading, isError: iserror } = useFetchChartYearly();
  const { data: User } = useFetchTotalUser();
  const { data: total_product } = useFetchTotalProducts();
  const {data: newProduct} = useFetchNewProduct();

  const chartData = {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: (year?.data || []).map((yearItem) => ({
      year: yearItem.year.toString(), // format string untuk tahun
      data: [
        {
          name: 'Total Pendapatan',
          data: yearItem.months.map(
            (month) =>
              month.totals.find((item) => item.total_income !== undefined)?.total_income || 0
          ),
        },
        {
          name: 'Total Penjualan',
          data: yearItem.months.map(
            (month) => month.totals.find((item) => item.sales !== undefined)?.sales || 0
          ),
        },
        {
          name: 'Total Produk',
          data: yearItem.months.map(
            (month) => month.totals.find((item) => item.total_items !== undefined)?.total_items || 0
          ),
        },
      ],
    })),
  };

  const gender = {
    total: Array.isArray(genderData)
      ? genderData.reduce((sum, item) => sum + (item.total || 0), 0)
      : 0,
    series: Array.isArray(genderData)
      ? genderData.map((item) => ({
          label: item.gender ? item.gender : 'Unknown',
          value: item.total || 0,
        }))
      : [],
  };

  const sold = {
    total_sold: Array.isArray(soldData) && soldData.length > 0 ? Number(soldData[0].total_sold) : 0,
    percent_change:
      Array.isArray(soldData) && soldData.length > 0 ? parseFloat(soldData[0].percentage) : 0,
    chart_data: Array.isArray(soldData) ? soldData.map((item) => Number(item.total_sold)) : [],
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid xs={12} md={8} sx={{ mb: 5 }}>
        <AppWelcome
          title={`Welcome back 👋 \n ${users?.username}`}
          // description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
          img={<SeoIllustration />}
        />
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Penjualan Perminggu"
            total={data[0]?.sales || 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total produk order"
            total={total_order?.total_orders || 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Produk"
            total={total_product.total_products || 0}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Pengguna"
            total={User.total_users || 0}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Total Balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales Profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={6}>
          <EcommerceYearlySales
            title="Penjualan pertahun"
            // subheader="(+43%) than last year"
            chart={chartData} // pass chartData yang sudah dipersiapkan
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={6}>
          <AnalyticsWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title="Terjual Berdasarkan Jenis Kelamin"
            total={gender.total}
            chart={{
              series:
                gender.series.length > 0
                  ? gender.series
                  : [
                      { label: 'Mens', value: 0 },
                      { label: 'Womens', value: 0 },
                    ],
            }}
            loading={fetching}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts title="Produk terbaru" list={newProduct} />
        </Grid> */}

        {/* <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Produk"
            percent={sold?.percent_change || 0}
            total={sold?.total_sold || 0}
            chart={{
              series:
                sold?.chart_data?.length > 0 ? sold.chart_data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
            loading={loading}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
