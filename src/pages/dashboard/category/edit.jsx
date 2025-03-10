import { Helmet } from 'react-helmet-async';
// sections
import CategoryEditView from 'src/sections/category/view/CategoryEditView';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Category</title>
      </Helmet>

      <CategoryEditView />
    </>
  );
}
