import { Helmet } from 'react-helmet-async';
// sections
import CreateShippingView from 'src/sections/checkout/create-shipping-view';
// ----------------------------------------------------------------------

export default function ShippingCreatePage() {
  return (
    <>
      <Helmet>
        <title> Shipping Create</title>
      </Helmet>

      <CreateShippingView />
    </>
  );
}
