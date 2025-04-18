import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
//category
import CategoryPage from 'src/pages/dashboard/category/category';
import CreatePage from 'src/pages/dashboard/category/create';
import EditPage from 'src/pages/dashboard/category/edit';
//banner
import BannerPage from 'src/pages/dashboard/banner/banner';
import CreateBannerPage from 'src/pages/dashboard/banner/create';
import EditBannerPage from 'src/pages/dashboard/banner/edit';
//discount
import DiscountPage from 'src/pages/dashboard/discount/discount';
import CreateDiscountPage from 'src/pages/dashboard/discount/create';
import EditDiscountPage from 'src/pages/dashboard/discount/edit';
import DiscountDetailsPage from 'src/pages/dashboard/discount/detail';
import RoleBaseGuard from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

// OVERVIEW

const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
//Manage USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        {/* <RoleBaseGuard allowedRoles={['admin']}> */}
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        {/* </RoleBaseGuard> */}
      </AuthGuard>
    ),
    children: [
      { element: <OverviewAnalyticsPage />, index: true },
      // { element: <IndexPage /> },
      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      {
        path: 'user',
        children: [
          { path: 'list', element: <UserListPage />, index: true },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'category',
        children: [
          { path: 'list', element: <CategoryPage />, index: true },
          { path: 'new', element: <CreatePage /> },
          { path: ':id/edit', element: <EditPage /> },
        ],
      },
      {
        path: 'discount',
        children: [
          { path: 'list', element: <DiscountPage />, index: true },
          { path: 'new', element: <CreateDiscountPage /> },
          { path: ':id/edit', element: <EditDiscountPage /> },
          { path: ':id', element: <DiscountDetailsPage /> },
        ],
      },
      {
        path: 'banner',
        children: [
          { path: 'list', element: <BannerPage />, index: true },
          { path: 'new', element: <CreateBannerPage /> },
          { path: ':id/edit', element: <EditBannerPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
    ],
  },
];
