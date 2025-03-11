import { Helmet } from 'react-helmet-async';
import BannerView from 'src/sections/banner/view/BannerView';
// sections

// ----------------------------------------------------------------------

export default function BannerPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Banner</title>
      </Helmet>

      <BannerView />
    </>
  );
}
