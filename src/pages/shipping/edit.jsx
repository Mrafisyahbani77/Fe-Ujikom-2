import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import EditShippingView from 'src/sections/checkout/edit-shipping-view';
// ----------------------------------------------------------------------

export default function ShippingEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Shipping Edit</title>
      </Helmet>

      <EditShippingView id={`${id}`} />
    </>
  );
}
