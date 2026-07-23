import React from 'react';
import FeaturedEditor from './FeaturedEditor';

export default function TopPicksEditor({ sectionId }: { sectionId: string }) {
  return (
    <FeaturedEditor
      sectionId={sectionId}
      title="Top Picks"
      description="Configure which articles appear in the homepage Top Picks section and their display order."
      endpoint="/articles/"
      patchUrlGenerator={(id) => `/articles/${id}/top-picks`}
      itemTitleField="title"
      itemCategoryField="category"
      itemStatusField="status"
      itemImageFields={['cover_image', 'hero_image']}
    />
  );
}
