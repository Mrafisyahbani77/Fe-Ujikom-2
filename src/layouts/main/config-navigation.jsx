import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useCheckoutContext } from 'src/sections/checkout/context';
import { useAuthContext } from 'src/auth/hooks';

export default function navConfig() {
  const checkout = useCheckoutContext();
  const { user } = useAuthContext(); // ambil user dari context auth
  // const users = user.data;

  return [
    {
      title: 'Beranda',
      icon: <Iconify icon="solar:home-2-bold-duotone" width={24} />,
      path: '/',
    },
    {
      title: 'Keranjang',
      path: paths.product.checkout,
      icon: <Iconify icon="mdi:cart" width={24} />,
      badge: user && checkout?.totalItems > 0 ? checkout.totalItems : undefined,
    },
  ];
}
