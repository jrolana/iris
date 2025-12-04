'use client';

import ApplicationView from '@/components/application/ApplicationView';
import {
  dummyApplication,
  dummyFiles,
  dummyInventors,
  dummyIprStatuses,
} from '@/lib/dummy-data/application';

function TechgenViewApplicationPage() {
  return (
    <ApplicationView
      mode="applicant"
      initialApplication={dummyApplication}
      initialAttachments={dummyFiles}
      initialInventors={dummyInventors}
      initialStatuses={dummyIprStatuses}
    />
  );
}

export default TechgenViewApplicationPage;