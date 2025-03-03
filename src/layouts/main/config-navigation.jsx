// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Beranda',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  // {
  //   title: 'Belanja',
  //   path: paths.product.root,
  // },
  {
    title: 'Keranjang',
    path: paths.product.checkout,
    icon: <Iconify icon="icon-park-solid:shopping" />,
  },
  // {
  //   title: 'Product',
  //   path: paths.product.demo.details,
  // },
  // {
  //   title: 'Checkout',
  //   path: paths.product.checkout,
  // },
  // {
  //   title: 'About us',
  //   path: paths.about,
  // },
  // {
  //   title: 'Contact us',
  //   path: paths.contact,
  // },
  // {
  //   title: 'FAQs',
  //   path: paths.faqs,
  // },
];
