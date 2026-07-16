import React from 'react';
import DynamicArrayEditor from '../components/DynamicArrayEditor';

export default function TBSTalksEditor() {
  const endpoint = '/tbs-talks/';
  const itemTitleField = 'name';
  const fields: any[] = [{name: 'name', label: 'Speaker Name', type: 'text'}, {name: 'designation', label: 'Designation', type: 'text'}, {name: 'date', label: 'Date', type: 'text'}, {name: 'photo_url', label: 'Photo', type: 'image', guidelineKey: 'talkSpeaker'}, {name: 'social_link', label: 'Instagram / Social Profile URL', type: 'text', placeholder: 'https://instagram.com/username'}, {name: 'display_order', label: 'Order', type: 'number'}];
  const defaultNewItem = {name: 'New Speaker', designation: '', date: '', photo_url: '', social_link: '', visibility: true};

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Manage items for TBSTalks.</p>
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
