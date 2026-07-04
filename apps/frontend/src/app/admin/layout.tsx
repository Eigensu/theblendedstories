import { Toaster } from 'sonner';
import { AdminProvider } from './contexts/AdminContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={3000}
        visibleToasts={3}
        expand={false}
        toastOptions={{
          style: {
            zIndex: 9999,
          },
          className: 'custom-sonner-toast'
        }}
      />
      <AdminProvider>
        {children}
      </AdminProvider>
    </div>
  );
}
