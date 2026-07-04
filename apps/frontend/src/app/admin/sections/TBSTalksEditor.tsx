import React from 'react';
import DynamicArrayEditor from '../components/DynamicArrayEditor';

export default function TBSTalksEditor() {
  const endpoint = '/tbs-talks';
  const itemTitleField = 'name';
  const fields = [{name: 'name', label: 'Speaker Name', type: 'text'}, {name: 'designation', label: 'Designation', type: 'text'}, {name: 'date', label: 'Date', type: 'text'}, {name: 'photo_url', label: 'Photo', type: 'image'}, {name: 'display_order', label: 'Order', type: 'number'}];
  const defaultNewItem = {name: 'New Speaker', designation: '', date: '', photo_url: '', visibility: true};

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Manage items for TBSTalks.</p>
      </div>
      <DynamicArrayEditor 
        endpoint={endpoint}
        itemTitleField={itemTitleField}
        fields={[{name: 'name', label: 'Speaker Name', type: 'text'}, {name: 'designation', label: 'Designation', type: 'text'}, {name: 'date', label: 'Date', type: 'text'}, {name: 'photo_url', label: 'Photo', type: 'image'}, {name: 'display_order', label: 'Order', type: 'number'}]}
        defaultNewItem={{name: 'New Speaker', designation: '', date: '', photo_url: '', visibility: true}}
      />
    </div>
  );
}
