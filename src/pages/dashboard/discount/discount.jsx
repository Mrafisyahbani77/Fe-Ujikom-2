import { Helmet } from 'react-helmet-async';
// sections
import CategoryView from 'src/sections/category/view/CategoryView';
import DiscountView from 'src/sections/discount/view/DiscountView';

// ----------------------------------------------------------------------

export default function DiscountPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Discount</title>
      </Helmet>

      <DiscountView/>
    </>
  );
}
