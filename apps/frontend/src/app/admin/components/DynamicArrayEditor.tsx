'use client';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Edit2, Plus, ChevronDown, ChevronUp, Copy, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../services/api';
import TextField from '../components/TextField';
import TextArea from '../components/TextArea';
import MediaUploader from '../components/MediaUploader';
import { toast } from 'sonner';
import { handleApiError } from '../services/errorHandler';
import { cn } from './TextField';
import { useAdmin } from '../contexts/AdminContext';

type ArrayEditorProps = {
  endpoint: string;
  itemTitleField: string;
  fields: { name: string; label: string; type: 'text' | 'textarea' | 'image' | 'video' | 'number'; guidelineKey?: import('../../../constants/imageGuidelines').GuidelineKey }[];
  defaultNewItem: any;
};

export default function DynamicArrayEditor({ endpoint, itemTitleField, fields, defaultNewItem }: ArrayEditorProps) {
  const [originalItems, setOriginalItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const { setHasUnsavedChanges, setIsSaving, registerSaveHandler } = useAdmin();

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => {
    const isChanged = JSON.stringify(items) !== JSON.stringify(originalItems);
    setHasUnsavedChanges(isChanged);
  }, [items, originalItems, setHasUnsavedChanges]);

  useEffect(() => {
    registerSaveHandler(handleGlobalSave);
  }, [items, originalItems]);

  const fetchItems = async () => {
    try {
      const data = await apiClient.get<any[]>(endpoint);
      console.log(`RAW API DATA FOR ${endpoint}:`, data);
      console.log("Array?", Array.isArray(data));
      console.log("Length:", data?.length);
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setItems(sorted);
      setOriginalItems(sorted);
    } catch (err: any) {
      handleApiError('Failed to fetch items', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalSave = async (publish: boolean) => {
    setIsSaving(true);
    try {
      const visibilityField = 'visibility';

      const payloadItems = items.map(item => ({
        ...item,
        status: publish ? 'published' : 'draft'
      }));

      // Find deleted items
      const originalIds = originalItems.map(i => i.id);
      const currentIds = items.map(i => i.id);
      const deletedIds = originalIds.filter(id => !currentIds.includes(id));

      // Handle deletions
      const baseUrl = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      for (const id of deletedIds) {
        if (!id.startsWith('new-')) {
          await apiClient.delete(`${baseUrl}/${id}`);
        }
      }

      // Handle creates and updates
      for (const item of payloadItems) {
        if (item.id.startsWith('new-')) {
          const { id, _id, ...rest } = item;
          await apiClient.post(endpoint, rest);
        } else {
          await apiClient.put(`${baseUrl}/${item.id}`, item);
        }
      }

      toast.success(publish ? 'Published successfully!' : 'Draft saved successfully!');
      await fetchItems(); // Refresh to get clean state and real IDs
    } catch (err: any) {
      handleApiError('Failed to save changes', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = () => {
    const newItem = { 
      ...defaultNewItem, 
      id: `new-${Date.now()}`, 
      display_order: items.length + 1 
    };
    setItems([...items, newItem]);
    setExpandedId(newItem.id);
  };

  const handleDuplicate = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const { id, _id, ...rest } = item;
    const newItem = {
      ...rest,
      id: `new-${Date.now()}`,
      display_order: items.length + 1
    };
    setItems([...items, newItem]);
  };

  const handleUpdate = (id: string, updates: any) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter(item => item.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destIndex, 0, reorderedItem);

    // Update display_order purely visually
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));
    
    setItems(updatedItems);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#111111] border border-zinc-800 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">List Items</h2>
        <button 
          onClick={handleCreate}
          className="flex items-center bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-[#111111] rounded-2xl border border-dashed border-zinc-800 shadow-sm">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No items yet</h3>
          <p className="text-sm text-zinc-500 mb-6 text-center max-w-sm">Create your first item to populate this section.</p>
          <button 
            onClick={handleCreate}
            className="text-sm font-semibold text-black hover:bg-zinc-200 bg-white px-6 py-2.5 rounded-lg transition-colors"
          >
            Create Item
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="array-list">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-4"
              >
                {items.map((item, index) => {
                  const isVisible = item.visibility;
                  
                  return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "bg-zinc-950 rounded-2xl border transition-all duration-200 overflow-hidden",
                          snapshot.isDragging ? "shadow-xl border-white scale-[1.02] z-50" : "shadow-sm border-zinc-800 hover:border-zinc-700",
                          !isVisible && "opacity-75 bg-black"
                        )}
                      >
                        <div 
                          className="flex items-center p-5 cursor-pointer select-none group"
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        >
                          <div 
                            {...provided.dragHandleProps} 
                            className="text-zinc-600 hover:text-white mr-4 cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-zinc-900 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden mr-5 bg-zinc-900 border border-zinc-800 flex-shrink-0 relative flex items-center justify-center">
                            {(item.image_url || item.photo_url || item.cover_image_url) ? (
                              <img 
                                src={item.image_url || item.photo_url || item.cover_image_url} 
                                alt="Thumbnail" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-zinc-700" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-base font-semibold text-white truncate">
                                {item[itemTitleField] || 'Untitled Item'}
                              </h4>
                              {!isVisible && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-500 truncate">
                              {item.designation || item.caption || item.date || item.description || `Order: ${item.display_order}`}
                            </p>
                          </div>

                          {/* Quick Actions (visible on hover) */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(item.id, { visibility: !isVisible });
                              }}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                              title={isVisible ? "Hide" : "Show"}
                            >
                              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={(e) => handleDuplicate(item, e)}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-2 text-zinc-500 hover:text-white hover:bg-red-950/30 hover:border-red-500/50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="w-px h-8 bg-zinc-800 mx-2"></div>
                          
                          <div className="p-2 text-zinc-400 bg-zinc-900 rounded-full group-hover:bg-zinc-800 transition-colors">
                            {expandedId === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>

                        {/* Expanded Form */}
                        {expandedId === item.id && (
                          <div className="p-6 bg-[#0A0A0A] border-t border-zinc-800 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {fields.map(field => {
                                if (field.type === 'text' || field.type === 'number') {
                                  return (
                                    <div key={field.name} className={field.name === itemTitleField ? "md:col-span-2" : ""}>
                                      <TextField 
                                        label={field.label}
                                        type={field.type}
                                        value={item[field.name]?.toString() || ''}
                                        onChange={(val) => handleUpdate(item.id, { [field.name]: field.type === 'number' ? Number(val) : val })}
                                      />
                                    </div>
                                  );
                                }
                                if (field.type === 'textarea') {
                                  return (
                                    <div key={field.name} className="md:col-span-2">
                                      <TextArea 
                                        label={field.label}
                                        value={item[field.name] || ''}
                                        onChange={(val) => handleUpdate(item.id, { [field.name]: val })}
                                      />
                                    </div>
                                  );
                                }
                                if (field.type === 'image' || field.type === 'video') {
                                  return (
                                    <div key={field.name} className="md:col-span-2">
                                      <MediaUploader 
                                        label={field.label}
                                        type={field.type}
                                        url={item[field.name]}
                                        onUploadSuccess={(url) => handleUpdate(item.id, { [field.name]: url })}
                                        onDeleteSuccess={() => handleUpdate(item.id, { [field.name]: null })}
                                        guidelineKey={field.guidelineKey}
                                      />
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                )})}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
