import { Helmet } from 'react-helmet-async';
// sections
import CategoryCreateView from 'src/sections/category/view/CategoryCreateView';

// ----------------------------------------------------------------------

export default function CreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Category</title>
      </Helmet>

      <CategoryCreateView />
    </>
  );
}
