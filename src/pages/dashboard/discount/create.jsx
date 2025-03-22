import { Helmet } from 'react-helmet-async';
// sections
import CategoryCreateView from 'src/sections/category/view/CategoryCreateView';
import DiscountCreateView from 'src/sections/discount/view/DiscountCreateView';

// ----------------------------------------------------------------------

export default function CreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Discount</title>
      </Helmet>

      <DiscountCreateView />
    </>
  );
}
