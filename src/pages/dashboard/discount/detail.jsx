import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import DiscountDetailView from 'src/sections/discount/view/DiscountDetailView';


// ----------------------------------------------------------------------

export default function DiscountDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Discount Details</title>
      </Helmet>

      <DiscountDetailView id={`${id}`} />
    </>
  );
}
