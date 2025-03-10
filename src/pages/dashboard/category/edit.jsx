import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
// sections
import CategoryEditView from 'src/sections/category/view/CategoryEditView';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Category</title>
      </Helmet>

      <CategoryEditView id={`${id}`} />
    </>
  );
}
