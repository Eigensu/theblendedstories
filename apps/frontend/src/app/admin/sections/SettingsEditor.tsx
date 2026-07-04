import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

export default function SettingsEditor({ sectionId }: { sectionId: string }) {
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
      const response = await apiClient.get<any>('/settings/');
      setData(response);
      setOriginalData(response);
      setStatus(response.status || 'published');
    } catch (err) {
      toast.error('Failed to load Settings data');
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
      const updated = await apiClient.put<any>('/settings/', payload);
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
      
      {/* Brand Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Brand Identity</h2>
          <p className="text-sm text-slate-500 mt-1">Core details used across the site.</p>
        </div>
        <div className="space-y-5">
          <TextField 
            label="Website Name" 
            value={data.website_name || ''} 
            onChange={(val) => setData({ ...data, website_name: val })} 
          />
          <MediaUploader 
            label="Global Logo" 
            type="image"
            url={data.logo_url} 
            onUploadSuccess={(url) => setData({ ...data, logo_url: url })}
            onDeleteSuccess={() => setData({ ...data, logo_url: null })}
          />
        </div>

        <div className="mt-8 mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Contact & Social</h2>
          <p className="text-sm text-slate-500 mt-1">Global contact links.</p>
        </div>
        <div className="space-y-5">
          <TextField 
            label="Primary Email" 
            value={data.primary_email || ''} 
            onChange={(val) => setData({ ...data, primary_email: val })} 
          />
          <TextField 
            label="Phone Number" 
            value={data.phone || ''} 
            onChange={(val) => setData({ ...data, phone: val })} 
          />
          <TextField 
            label="Instagram URL" 
            value={data.instagram_url || ''} 
            onChange={(val) => setData({ ...data, instagram_url: val })} 
          />
          <TextField 
            label="Facebook URL" 
            value={data.facebook_url || ''} 
            onChange={(val) => setData({ ...data, facebook_url: val })} 
          />
          <TextField 
            label="YouTube URL" 
            value={data.youtube_url || ''} 
            onChange={(val) => setData({ ...data, youtube_url: val })} 
          />
        </div>
      </div>

      {/* Section Headings Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Section Headings</h2>
          <p className="text-sm text-slate-500 mt-1">Global titles for list-based sections.</p>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">What We Cover</h3>
            <TextField 
              label="Title" 
              value={data.what_we_cover_title || ''} 
              onChange={(val) => setData({ ...data, what_we_cover_title: val })} 
            />
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">The Edit</h3>
            <TextField 
              label="Title" 
              value={data.the_edit_title || ''} 
              onChange={(val) => setData({ ...data, the_edit_title: val })} 
            />
            <TextArea 
              label="Description" 
              value={data.the_edit_description || ''} 
              onChange={(val) => setData({ ...data, the_edit_description: val })} 
            />
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">TBS Talks</h3>
            <TextField 
              label="Title" 
              value={data.tbs_talks_title || ''} 
              onChange={(val) => setData({ ...data, tbs_talks_title: val })} 
            />
            <TextField 
              label="Subtitle" 
              value={data.tbs_talks_subtitle || ''} 
              onChange={(val) => setData({ ...data, tbs_talks_subtitle: val })} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}
