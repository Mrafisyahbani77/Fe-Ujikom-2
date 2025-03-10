import { Helmet } from 'react-helmet-async';
// sections
import CategoryView from 'src/sections/category/view/CategoryView';

// ----------------------------------------------------------------------

export default function CategoryPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category</title>
      </Helmet>

      <CategoryView />
    </>
  );
}
