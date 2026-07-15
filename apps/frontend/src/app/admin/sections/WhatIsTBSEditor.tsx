import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { useAdmin } from '../contexts/AdminContext';

type WhatIsTBSData = {
  title: string;
  paragraphs: string[];
  image_url: string | null;
  button_text: string;
  button_link: string | null;
  status: string;
};

export default function WhatIsTBSEditor({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<WhatIsTBSData | null>(null);
  const [originalData, setOriginalData] = useState<WhatIsTBSData | null>(null);
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
      const response = await apiClient.get<WhatIsTBSData>('/what-is-tbs/');
      if (!response.paragraphs || response.paragraphs.length < 3) {
        response.paragraphs = [
          response.paragraphs?.[0] || '', 
          response.paragraphs?.[1] || '', 
          response.paragraphs?.[2] || ''
        ];
      }
      setData(response);
      setOriginalData(response);
      setStatus(response.status);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
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
      const updated = await apiClient.put<WhatIsTBSData>('/what-is-tbs/', payload);
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

  const updateParagraph = (index: number, val: string) => {
    if (!data) return;
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = val;
    setData({ ...data, paragraphs: newParagraphs });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-96 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
        <div className="lg:col-span-4 h-96 bg-[#111111] rounded-2xl border border-[#222222] animate-pulse"></div>
      </div>
    );
  }
  if (!data) return <div className="p-12 text-center text-zinc-400 bg-[#111111] rounded-2xl border border-[#222222]">Failed to load data.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full pb-12">
      
      {/* Text Content Card */}
      <div className="lg:col-span-8 bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">About Content</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage the title, paragraphs, and CTA button.</p>
        </div>

        <div className="space-y-6">
          <TextField 
            label="Section Title" 
            value={data.title || ''} 
            onChange={(val) => setData({ ...data, title: val })} 
          />
          
          <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222222] space-y-5">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Story Paragraphs</h3>
            {[0, 1, 2].map((idx) => (
              <TextArea 
                key={idx}
                label={`Paragraph ${idx + 1}`} 
                value={data.paragraphs?.[idx] || ''} 
                onChange={(val) => updateParagraph(idx, val)} 
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5 pt-2">
            <TextField 
              label="Button Text" 
              value={data.button_text || ''} 
              onChange={(val) => setData({ ...data, button_text: val })} 
            />
            <TextField 
              label="Button Link" 
              value={data.button_link || ''} 
              onChange={(val) => setData({ ...data, button_link: val })} 
              placeholder="/about"
            />
          </div>
        </div>
      </div>

      {/* Media Card */}
      <div className="lg:col-span-4 bg-[#111111] rounded-2xl shadow-sm border border-[#222222] p-8 h-fit sticky top-24">
        <div className="mb-6 border-b border-[#222222] pb-4">
          <h2 className="text-lg font-semibold text-white">Featured Media</h2>
          <p className="text-sm text-zinc-400 mt-1">The portrait image shown on the right side.</p>
        </div>
        <MediaUploader 
          label="Portrait Image" 
          type="image"
          url={data.image_url} 
          onUploadSuccess={(url) => setData({ ...data, image_url: url })}
          onDeleteSuccess={() => setData({ ...data, image_url: null })}
          guidelineKey="default"
        />
      </div>

    </div>
  );
}
