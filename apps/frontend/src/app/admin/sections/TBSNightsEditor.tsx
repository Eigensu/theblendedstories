import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

type TBSNightsData = {
  video_url: string | null;
  poster_url: string | null;
  title: string;
  subtitle: string;
  paragraphs: string[];
  button_text: string;
  button_link: string;
  status: string;
};

export default function TBSNightsEditor({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<TBSNightsData | null>(null);
  const [originalData, setOriginalData] = useState<TBSNightsData | null>(null);
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
      const response = await apiClient.get<TBSNightsData>('/tbs-nights/');
      setData(response);
      setOriginalData(response);
      setStatus(response.status);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load TBS Nights data');
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
      const updated = await apiClient.put<TBSNightsData>('/tbs-nights/', payload);
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
        <div className="h-96 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
        <div className="h-96 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
      </div>
    );
  }
  if (!data) return <div className="p-12 text-center text-zinc-400 bg-[#111111] rounded-2xl border border-[#222222]">Failed to load data.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full pb-12">
      
      {/* Media Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8 h-fit">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">Nights Media</h2>
          <p className="text-sm text-zinc-400 mt-1">Video and poster imagery for the dinner series.</p>
        </div>
        <div className="space-y-6">
          <MediaUploader 
            label="Background Video" 
            type="video"
            url={data.video_url} 
            onUploadSuccess={(url) => setData({ ...data, video_url: url })}
            onDeleteSuccess={() => setData({ ...data, video_url: null })}
          />
          <MediaUploader 
            label="Poster Image" 
            type="image"
            url={data.poster_url} 
            onUploadSuccess={(url) => setData({ ...data, poster_url: url })}
            onDeleteSuccess={() => setData({ ...data, poster_url: null })}
            guidelineKey="tbsNightsPoster"
          />
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">Event Details</h2>
          <p className="text-sm text-zinc-400 mt-1">Copy and CTAs for TBS Nights.</p>
        </div>
        <div className="space-y-5">
          <TextField 
            label="Section Title" 
            value={data.title} 
            onChange={(val) => setData({ ...data, title: val })} 
          />
          <TextField 
            label="Subtitle" 
            value={data.subtitle} 
            onChange={(val) => setData({ ...data, subtitle: val })} 
          />
          
          <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222222] space-y-5 mt-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Description Paragraphs</h3>
            <TextArea 
              label="Paragraph 1" 
              value={data.paragraphs[0] || ''} 
              onChange={(val) => {
                const newP = [...data.paragraphs];
                newP[0] = val;
                setData({ ...data, paragraphs: newP });
              }} 
            />
            <TextArea 
              label="Paragraph 2" 
              value={data.paragraphs[1] || ''} 
              onChange={(val) => {
                const newP = [...data.paragraphs];
                newP[1] = val;
                setData({ ...data, paragraphs: newP });
              }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-5 pt-2">
            <TextField 
              label="Button Text" 
              value={data.button_text} 
              onChange={(val) => setData({ ...data, button_text: val })} 
            />
            <TextField 
              label="Button Link" 
              value={data.button_link} 
              onChange={(val) => setData({ ...data, button_link: val })} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}
