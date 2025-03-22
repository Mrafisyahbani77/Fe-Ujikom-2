import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
// sections
import CategoryEditView from 'src/sections/category/view/CategoryEditView';
import DiscountEditView from 'src/sections/discount/view/DiscountEditView';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Discount</title>
      </Helmet>

      <DiscountEditView id={`${id}`} />
    </>
  );
}
