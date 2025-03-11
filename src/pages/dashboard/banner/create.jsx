import { Helmet } from 'react-helmet-async';
// sections
import BannerCreateView from 'src/sections/banner/view/BannerCreateView';

// ----------------------------------------------------------------------

export default function CreateBannerPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Banner</title>
      </Helmet>

      <BannerCreateView />
    </>
  );
}
