import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

export default function SEOEditor({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler, setStatus } = useAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const isChanged = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasUnsavedChanges(isChanged);
  }, [data, originalData, setHasUnsavedChanges]);

  useEffect(() => {
    registerSaveHandler(handleGlobalSave);
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get<any>('/seo/');
      setData(response);
      setOriginalData(response);
      setStatus(response.status || 'published');
    } catch (err) {
      toast.error('Failed to load SEO data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSave = async (publish: boolean = false) => {
    if (!data) return;
    setIsSaving(true);
    
    const payload = { ...data };
    if (publish) payload.status = 'published';
    else payload.status = 'draft';

    try {
      const updated = await apiClient.put<any>('/seo/', payload);
      setData(updated);
      setOriginalData(updated);
      setStatus(updated.status);
      toast.success(publish ? 'Published successfully!' : 'Draft saved successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
      </div>
    );
  }
  if (!data) return <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">Failed to load data.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full pb-12">
      
      {/* Meta Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Search Engine Meta</h2>
          <p className="text-sm text-slate-500 mt-1">Configure how your site appears in Google searches.</p>
        </div>
        <div className="space-y-5">
          <TextField 
            label="Meta Title" 
            value={data.title || ''} 
            onChange={(val) => setData({ ...data, title: val })} 
          />
          <TextArea 
            label="Meta Description" 
            value={data.description || ''} 
            onChange={(val) => setData({ ...data, description: val })} 
          />
          <TextField 
            label="Keywords" 
            value={data.keywords || ''} 
            onChange={(val) => setData({ ...data, keywords: val })} 
            placeholder="lifestyle, magazine, culture, stories"
          />
        </div>
      </div>

      {/* Social Media Assets */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Social Assets</h2>
          <p className="text-sm text-slate-500 mt-1">Images shown when sharing links on iMessage, Twitter, etc.</p>
        </div>
        <div className="space-y-6">
          <MediaUploader 
            label="Open Graph Image (1200x630)" 
            type="image"
            url={data.og_image_url} 
            onUploadSuccess={(url) => setData({ ...data, og_image_url: url })}
            onDeleteSuccess={() => setData({ ...data, og_image_url: null })}
          />
          <MediaUploader 
            label="Favicon (32x32)" 
            type="image"
            url={data.favicon_url} 
            onUploadSuccess={(url) => setData({ ...data, favicon_url: url })}
            onDeleteSuccess={() => setData({ ...data, favicon_url: null })}
          />
        </div>
      </div>

    </div>
  );
}
