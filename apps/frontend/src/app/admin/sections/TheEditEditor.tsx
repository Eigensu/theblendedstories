import React from 'react';
import DynamicArrayEditor from '../components/DynamicArrayEditor';

export default function TheEditEditor() {
  const endpoint = '/the-edit/';
  const itemTitleField = 'title';
  const fields = [
    { name: 'display_number', label: 'Display Number (e.g. "01")', type: 'text' as const },
    { name: 'title', label: 'Title', type: 'text' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'cover_image_url', label: 'Cover Image', type: 'image' as const },
    { name: 'story_url', label: 'Story URL', type: 'text' as const },
    { name: 'display_order', label: 'Sort Order', type: 'number' as const },
  ];

  const defaultNewItem = {
    title: 'New Article',
    description: '',
    cover_image_url: '',
    display_number: '00',
    story_url: '',
    published: true,
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Manage the editorial articles shown in the carousel.</p>
      </div>
      <DynamicArrayEditor 
        endpoint={endpoint}
        itemTitleField={itemTitleField}
        fields={fields}
        defaultNewItem={defaultNewItem}
      />
    </div>
  );
}
