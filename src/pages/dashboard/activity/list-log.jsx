import { Helmet } from 'react-helmet-async';
// sections
import ActivityLogView from 'src/sections/activitylog/view/ActivityLogView';

// ----------------------------------------------------------------------

export default function LogListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Activity Log</title>
      </Helmet>

      <ActivityLogView />
    </>
  );
}
