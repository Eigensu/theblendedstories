import os

EDITOR_TEMPLATE = """import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import SaveButton from '../components/SaveButton';

export default function {name}Editor({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClient.get<any>('/{endpoint}/');
      setData(response);
      setOriginalData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasUnsavedChanges = JSON.stringify(data) !== JSON.stringify(originalData);

  const handleSave = async (publish: boolean = false) => {
    if (!data) return;
    setIsSaving(true);
    
    const payload = { ...data };
    if (publish) payload.status = 'published';
    else payload.status = 'draft';

    try {
      const updated = await apiClient.put<any>('/{endpoint}/', payload);
      setData(updated);
      setOriginalData(updated);
      alert(publish ? 'Published successfully!' : 'Draft saved successfully!');
    } catch (err) {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">{name} Details</h2>
        <SaveButton 
          isSaving={isSaving} 
          hasUnsavedChanges={hasUnsavedChanges} 
          status={data.status}
          onSave={() => handleSave(false)} 
          onPublish={() => handleSave(true)}
        />
      </div>

      <div className="space-y-4">
        {Object.keys(data).map(key => {
          if (['id', 'created_at', 'updated_at', 'is_active', 'status', 'paragraphs', 'quick_links', 'locations', 'social_links', 'legal_links'].includes(key)) return null;
          
          if (key.includes('url') || key.includes('image') || key.includes('video')) {
            return (
              <MediaUploader 
                key={key}
                label={key.replace(/_/g, ' ').toUpperCase()} 
                type={key.includes('video') ? 'video' : 'image'}
                url={data[key]} 
                onUploadSuccess={(url) => setData({ ...data, [key]: url })}
                onDeleteSuccess={() => setData({ ...data, [key]: null })}
              />
            )
          }

          if (key.includes('description') || key.includes('text')) {
             return (
               <TextArea 
                  key={key}
                  label={key.replace(/_/g, ' ').toUpperCase()} 
                  value={data[key] || ''} 
                  onChange={(val) => setData({ ...data, [key]: val })} 
               />
             )
          }

          return (
            <TextField 
              key={key}
              label={key.replace(/_/g, ' ').toUpperCase()} 
              value={data[key] || ''} 
              onChange={(val) => setData({ ...data, [key]: val })} 
            />
          );
        })}
      </div>
    </div>
  );
}
"""

ARRAY_TEMPLATE = """import React from 'react';
import DynamicArrayEditor from '../components/DynamicArrayEditor';

export default function {name}Editor() {
  const endpoint = '/{endpoint}';
  const itemTitleField = '{title_field}';
  const fields = {fields};
  const defaultNewItem = {default_item};

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Manage items for {name}.</p>
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
"""

CONFIGS = [
    ("WhatIsTBS", "what-is-tbs", "singleton"),
    ("Footer", "footer", "singleton"),
    ("SEO", "seo", "singleton"),
    ("Settings", "settings", "singleton"),
    ("WhatWeCover", "what-we-cover", "array", "caption", 
     "[{name: 'caption', label: 'Caption', type: 'text'}, {name: 'image_url', label: 'Image', type: 'image'}, {name: 'display_order', label: 'Order', type: 'number'}]", 
     "{caption: 'New Slide', image_url: '', visibility: true}"),
    ("TBSTalks", "tbs-talks", "array", "name", 
     "[{name: 'name', label: 'Speaker Name', type: 'text'}, {name: 'designation', label: 'Designation', type: 'text'}, {name: 'date', label: 'Date', type: 'text'}, {name: 'photo_url', label: 'Photo', type: 'image'}, {name: 'display_order', label: 'Order', type: 'number'}]", 
     "{name: 'New Speaker', designation: '', date: '', photo_url: '', visibility: true}")
]

def generate():
    base_dir = "apps/frontend/src/app/admin/sections"
    for item in CONFIGS:
        if item[2] == "singleton":
            content = EDITOR_TEMPLATE.replace("{name}", item[0]).replace("{endpoint}", item[1])
        else:
            content = ARRAY_TEMPLATE.replace("{name}", item[0]).replace("{endpoint}", item[1]).replace("{title_field}", item[3]).replace("{fields}", item[4]).replace("{default_item}", item[5])
        
        with open(f"{base_dir}/{item[0]}Editor.tsx", "w") as f:
            f.write(content)

if __name__ == "__main__":
    generate()
