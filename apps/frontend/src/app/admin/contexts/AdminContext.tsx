'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AdminContextType = {
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (unsaved: boolean) => void;
  status: string;
  setStatus: (status: string) => void;
  onSave: (publish: boolean) => Promise<void>;
  registerSaveHandler: (handler: (publish: boolean) => Promise<void>) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [status, setStatus] = useState('published');
  
  // We hold a reference to the active editor's save function
  const [saveHandler, setSaveHandler] = useState<{ fn: (publish: boolean) => Promise<void> } | null>(null);

  const registerSaveHandler = (handler: (publish: boolean) => Promise<void>) => {
    setSaveHandler({ fn: handler });
  };

  const onSave = async (publish: boolean) => {
    if (saveHandler?.fn) {
      await saveHandler.fn(publish);
    }
  };

  return (
    <AdminContext.Provider value={{
      isSaving, setIsSaving,
      hasUnsavedChanges, setHasUnsavedChanges,
      status, setStatus,
      onSave, registerSaveHandler
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
