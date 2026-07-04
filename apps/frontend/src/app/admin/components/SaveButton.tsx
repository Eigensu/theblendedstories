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
            className="text-sm text-amber-600 font-medium"
          >
            Unsaved changes
          </motion.span>
        )}
      </AnimatePresence>
      
      <button
        onClick={onSave}
        disabled={isSaving || !hasUnsavedChanges}
        className={`relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 overflow-hidden ${
          isSaving 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : hasUnsavedChanges
              ? 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 active:scale-95'
              : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />}
        {isSaving ? 'Saving...' : 'Save Draft'}
      </button>

      {onPublish && (
        <button
          onClick={onPublish}
          disabled={isSaving || (status === 'published' && !hasUnsavedChanges)}
          className={`relative flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm overflow-hidden ${
            isSaving || (status === 'published' && !hasUnsavedChanges)
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/10'
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            'Publish'
          )}
        </button>
      )}
    </div>
  );
}
