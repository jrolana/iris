'use client';

import ApplicationView from '@/components/application/ApplicationView';
import {
  dummyApplication,
  dummyFiles,
  dummyInventors,
  dummyIprStatuses,
} from '@/lib/dummy-data/application';

function TtbdoViewApplicationPage() {
  return (
    <ApplicationView
      mode="admin"
      initialApplication={dummyApplication}
      initialAttachments={dummyFiles}
      initialInventors={dummyInventors}
      initialStatuses={dummyIprStatuses}
    />
  );
}

export default TtbdoViewApplicationPage;