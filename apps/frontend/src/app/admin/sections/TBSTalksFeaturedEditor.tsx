import React from 'react';
import FeaturedEditor from './FeaturedEditor';

export default function TBSTalksFeaturedEditor({ sectionId }: { sectionId: string }) {
  return (
    <FeaturedEditor
      sectionId={sectionId}
      title="Featured Talks"
      description="Configure which talks appear in the homepage TBS Talks section and their display order."
      endpoint="/tbs-talks/"
      patchUrlGenerator={(id) => `/tbs-talks/${id}/featured`}
      itemTitleField="name"
      itemCategoryField="designation"
      itemStatusField="visibility"
      itemImageFields={['photo_url']}
    />
  );
}
