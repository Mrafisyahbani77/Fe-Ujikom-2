import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useCheckoutContext } from 'src/sections/checkout/context';

// Pastikan checkout hanya dipanggil dalam fungsi
export default function navConfig() {
  const checkout = useCheckoutContext();

  return [
    {
      title: 'Beranda',
      icon: <Iconify icon="solar:home-2-bold-duotone" width={24} />,
      path: '/',
    },
    {
      title: 'Keranjang',
      path: paths.product.checkout,
      // Sesuai dengan CartIcon
      icon: <Iconify icon="solar:cart-3-bold" width={24} />,
      badge: checkout?.totalItems || 0, // Tambahkan badge untuk indikator jumlah item
    },
  ];
}
