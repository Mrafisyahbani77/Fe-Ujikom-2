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
import EcommerceLatestProducts from '../../e-commerce/ecommerce-latest-products';
import EcommerceWidgetSummary from '../../e-commerce/ecommerce-widget-summary';
import EcommerceSaleByGender from '../../e-commerce/ecommerce-sale-by-gender';
import EcommerceYearlySales from '../../e-commerce/ecommerce-yearly-sales';
import {
  useFetchChartWeekly,
  useFetchChartOrder,
  useFetchChartProductSold,
  useFetchChartSaleByGender,
  useFetchChartYearly,
} from 'src/utils/chart';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const { data, isLoading, isError } = useFetchChartWeekly();
  const { data: total_order, isLoading: load, isError: error } = useFetchChartOrder();
  const { data: sold, isLoading: loading, isError: Error } = useFetchChartProductSold();
  const { data: gender, isLoading: fetching, isError: not_work } = useFetchChartSaleByGender();
  const { data: year, isLoading: loadd, isError: ERror } = useFetchChartYearly();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Weekly Sales"
            total={data}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Item Orders"
            total={total_order}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Product Sold"
            percent={sold?.percent_change || 0}
            total={sold?.total_sold || 0}
            chart={{
              series: sold?.chart_data || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
            loading={loading}
          />
        </Grid>

        <Grid xs={12} md={4}>
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
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
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
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
        </Grid> */}

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title="Sale By Gender"
            total={gender?.total || 0}
            chart={{
              series: gender?.series || [
                { label: 'Mens', value: 0 },
                { label: 'Womens', value: 0 }
              ],
            }}
            loading={fetching}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title="Yearly Sales"
            subheader="(+43%) than last year"
            chart={{
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
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Total Income',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Total Income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
