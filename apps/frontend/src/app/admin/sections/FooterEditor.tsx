import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

export default function FooterEditor({ sectionId }: { sectionId: string }) {
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
      const response = await apiClient.get<any>('/footer/');
      setData(response);
      setOriginalData(response);
      setStatus(response.status);
    } catch (err) {
      toast.error('Failed to load Footer data');
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
      const updated = await apiClient.put<any>('/footer/', payload);
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
        <div className="h-64 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
        <div className="h-64 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
      </div>
    );
  }
  if (!data) return <div className="p-12 text-center text-zinc-400 bg-[#111111] rounded-2xl border border-[#222222]">Failed to load data.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full pb-12">
      
      {/* Media Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8 h-fit">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">Footer Media</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage the logo and background image.</p>
        </div>
        <div className="space-y-6">
          <MediaUploader 
            label="Footer Logo" 
            type="image"
            url={data.logo_url} 
            onUploadSuccess={(url) => setData({ ...data, logo_url: url })}
            onDeleteSuccess={() => setData({ ...data, logo_url: null })}
            guidelineKey="footerLogo"
          />
          <MediaUploader 
            label="Background Image" 
            type="image"
            url={data.background_url} 
            onUploadSuccess={(url) => setData({ ...data, background_url: url })}
            onDeleteSuccess={() => setData({ ...data, background_url: null })}
            guidelineKey="footerBackground"
          />
        </div>
      </div>

      {/* General Settings Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">General Information</h2>
          <p className="text-sm text-zinc-400 mt-1">Copyright and contact details.</p>
        </div>
        <div className="space-y-5">
          <TextField 
            label="Copyright Text" 
            value={data.copyright || ''} 
            onChange={(val) => setData({ ...data, copyright: val })} 
          />
          <TextField 
            label="Contact Email" 
            value={data.email || ''} 
            onChange={(val) => setData({ ...data, email: val })} 
          />
          <TextField 
            label="Contact Phone" 
            value={data.phone || ''} 
            onChange={(val) => setData({ ...data, phone: val })} 
          />
        </div>
        
        <div className="mt-8 mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">Advanced Navigation</h2>
          <p className="text-sm text-zinc-400 mt-1">Links are currently configured in the backend schema.</p>
        </div>
        <div className="text-sm text-zinc-400 bg-[#0A0A0A] p-4 rounded-xl border border-[#222222]">
          Advanced array editor for links (Locations, Quick Links, Social Links) will be added in a future update.
        </div>
      </div>

    </div>
  );
}
