import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SaveButtonProps = {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onPublish?: () => void;
  status?: string;
};

export default function SaveButton({ isSaving, hasUnsavedChanges, onSave, onPublish, status }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-sm text-zinc-400 font-medium"
          >
            Unsaved changes
          </motion.span>
        )}
      </AnimatePresence>
      
      <button
        onClick={onSave}
        disabled={isSaving || !hasUnsavedChanges}
        className={`relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden ${
          isSaving 
            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
            : hasUnsavedChanges
              ? 'bg-black border border-zinc-700 text-white shadow-sm hover:bg-zinc-900 active:scale-95'
              : 'bg-black border border-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
      >
        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin text-zinc-500" />}
        {isSaving ? 'Saving...' : 'Save Draft'}
      </button>

      {onPublish && (
        <button
          onClick={onPublish}
          disabled={isSaving || (status === 'published' && !hasUnsavedChanges)}
          className={`relative flex items-center justify-center px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm overflow-hidden ${
            isSaving || (status === 'published' && !hasUnsavedChanges)
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
          ) : (
            'Publish'
          )}
        </button>
      )}
    </div>
  );
}
