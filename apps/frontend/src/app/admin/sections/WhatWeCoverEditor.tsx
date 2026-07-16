import React from 'react';
import DynamicArrayEditor from '../components/DynamicArrayEditor';

export default function WhatWeCoverEditor() {
  const endpoint = '/what-we-cover/';
  const itemTitleField = 'caption';
  const fields = [{name: 'caption', label: 'Caption', type: 'text'}, {name: 'image_url', label: 'Image', type: 'image'}, {name: 'display_order', label: 'Order', type: 'number'}];
  const defaultNewItem = {caption: 'New Slide', image_url: '', visibility: true};

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Manage items for WhatWeCover.</p>
      </div>
      <DynamicArrayEditor 
        endpoint={endpoint}
        itemTitleField={itemTitleField}
        fields={[{name: 'caption', label: 'Caption', type: 'text'}, {name: 'image_url', label: 'Image', type: 'image', guidelineKey: 'whatWeCover' as any}, {name: 'display_order', label: 'Order', type: 'number'}]}
        defaultNewItem={{caption: 'New Slide', image_url: '', visibility: true}}
      />
    </div>
  );
}
