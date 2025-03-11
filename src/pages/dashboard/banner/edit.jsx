import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
// sections
import BannerEditView from 'src/sections/banner/view/BannerEditView';

// ----------------------------------------------------------------------

export default function EditBannerPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Banner</title>
      </Helmet>

      <BannerEditView id={`${id}`} />
    </>
  );
}
