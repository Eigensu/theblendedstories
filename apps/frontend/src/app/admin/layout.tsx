import { Toaster } from 'sonner';
import { AdminProvider } from './contexts/AdminContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white">
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
            background: 'black',
            color: 'white',
            borderColor: '#222',
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
