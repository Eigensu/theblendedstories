import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

type HeroData = {
  video_desktop_url: string | null;
  video_mobile_url: string | null;
  modal_title_join: string;
  modal_title_login: string;
  modal_description: string;
  button_text: string;
  button_links: string | null;
  status: string;
};

export default function HeroEditor({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<HeroData | null>(null);
  const [originalData, setOriginalData] = useState<HeroData | null>(null);
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
      const response = await apiClient.get<HeroData>('/hero/');
      setData(response);
      setOriginalData(response);
      setStatus(response.status);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load Hero data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSave = async (publish: boolean) => {
    if (!data) return;
    setIsSaving(true);
    
    const payload = { ...data };
    if (publish) payload.status = 'published';
    else payload.status = 'draft';

    try {
      const updated = await apiClient.put<HeroData>('/hero/', payload);
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
      
      {/* Background Media Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Background Media</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage the video loop shown in the Hero section on different devices.</p>
        </div>
        <div className="space-y-6">
          <MediaUploader 
            label="Desktop Video" 
            type="video"
            url={data.video_desktop_url} 
            onUploadSuccess={(url) => setData({ ...data, video_desktop_url: url })}
            onDeleteSuccess={() => setData({ ...data, video_desktop_url: null })}
          />
          <MediaUploader 
            label="Mobile Video" 
            type="video"
            url={data.video_mobile_url} 
            onUploadSuccess={(url) => setData({ ...data, video_mobile_url: url })}
            onDeleteSuccess={() => setData({ ...data, video_mobile_url: null })}
          />
        </div>
      </div>

      {/* Modal Content Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Waitlist Modal</h2>
          <p className="text-sm text-zinc-400 mt-1">Content shown when users click "Get Blended".</p>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <TextField 
              label="Join Title" 
              value={data.modal_title_join} 
              onChange={(val) => setData({ ...data, modal_title_join: val })} 
            />
            <TextField 
              label="Login Title" 
              value={data.modal_title_login} 
              onChange={(val) => setData({ ...data, modal_title_login: val })} 
            />
          </div>
          <TextArea 
            label="Modal Description" 
            value={data.modal_description} 
            onChange={(val) => setData({ ...data, modal_description: val })} 
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField 
              label="Button Text" 
              value={data.button_text} 
              onChange={(val) => setData({ ...data, button_text: val })} 
            />
            <TextField 
              label="Button Link" 
              value={data.button_links || ''} 
              onChange={(val) => setData({ ...data, button_links: val })} 
              placeholder="/join"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
