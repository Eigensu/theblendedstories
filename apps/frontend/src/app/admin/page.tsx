'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminSections } from './sections/config';
import { apiClient } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, 
  Settings, Users, Moon, Sun, Monitor, Link, 
  LogOut, PanelLeftClose, PanelLeftOpen, Search, ExternalLink, Loader2
} from 'lucide-react';
import StatusBadge from './components/StatusBadge';
import { useAdmin } from './contexts/AdminContext';

// Map icon strings from config to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  'monitor': <Monitor className="w-5 h-5" />,
  'info': <FileText className="w-5 h-5" />,
  'image': <ImageIcon className="w-5 h-5" />,
  'moon': <Moon className="w-5 h-5" />,
  'book': <FileText className="w-5 h-5" />,
  'users': <Users className="w-5 h-5" />,
  'layout': <LayoutDashboard className="w-5 h-5" />,
  'search': <Search className="w-5 h-5" />,
  'settings': <Settings className="w-5 h-5" />
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);
  const { isSaving, hasUnsavedChanges, status, onSave } = useAdmin();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    apiClient.get('/auth/me').catch(() => {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    });
  }, [router]);

  const activeSection = adminSections.find((s) => s.id === activeSectionId) || adminSections[0];
  const ActiveComponent = activeSection.component;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const getBreadcrumb = () => {
    if (activeSectionId === 'media_library') return 'Dashboard / Media Library';
    const isPage = adminSections.findIndex(s => s.id === activeSectionId) < adminSections.length - 3;
    if (isPage) return `Dashboard / Pages / Home / ${activeSection.title}`;
    return `Dashboard / ${activeSection.title}`;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.aside 
          initial={{ width: isSidebarOpen ? 280 : 80 }}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-[#0F172A] text-slate-300 flex-shrink-0 flex flex-col shadow-xl z-20 border-r border-slate-800"
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white tracking-tight">TBS</span>
                </div>
                <h2 className="text-sm font-semibold tracking-wide text-white">WORKSPACE</h2>
              </motion.div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5 mx-auto" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
            <ul className="space-y-1 px-3">
              {/* Dashboard */}
              <li>
                <button
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
                  {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                </button>
              </li>

              {/* Pages Group */}
              <li className="pt-4">
                <button 
                  onClick={() => setPagesOpen(!pagesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  {isSidebarOpen ? (
                    <>
                      <span>Pages</span>
                      <motion.div animate={{ rotate: pagesOpen ? 90 : 0 }}>
                        <span className="text-lg leading-none">›</span>
                      </motion.div>
                    </>
                  ) : (
                    <FileText className="w-5 h-5 mx-auto" />
                  )}
                </button>
                
                <AnimatePresence>
                  {pagesOpen && isSidebarOpen && (
                    <motion.ul 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {adminSections.slice(0, -3).map((section) => {
                        const isActive = activeSectionId === section.id;
                        return (
                          <li key={section.id}>
                            <button
                              onClick={() => setActiveSectionId(section.id)}
                              className={`w-full flex items-center pl-10 pr-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive 
                                  ? 'bg-blue-600/10 text-blue-400' 
                                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                              }`}
                            >
                              {isActive && <motion.div layoutId="active-indicator" className="absolute left-3 w-1 h-5 bg-blue-500 rounded-full" />}
                              <span className="mr-3 opacity-70">{iconMap[section.icon] || <FileText className="w-4 h-4" />}</span>
                              {section.title}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li className="my-4 border-t border-slate-800/50"></li>

              {/* Global Sections */}
              {adminSections.slice(-3).map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSectionId(section.id)}
                      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-600/10 text-blue-400' 
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      {isActive && isSidebarOpen && <motion.div layoutId="active-indicator" className="absolute left-3 w-1 h-5 bg-blue-500 rounded-full" />}
                      <span className={`${!isSidebarOpen && 'mx-auto'}`}>
                        {iconMap[section.icon] || <Settings className="w-5 h-5" />}
                      </span>
                      {isSidebarOpen && <span className="ml-3">{section.title}</span>}
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  onClick={() => setActiveSectionId('media_library')}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeSectionId === 'media_library' 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {activeSectionId === 'media_library' && isSidebarOpen && <motion.div layoutId="active-indicator" className="absolute left-3 w-1 h-5 bg-blue-500 rounded-full" />}
                  <span className={`${!isSidebarOpen && 'mx-auto'}`}>
                    <ImageIcon className="w-5 h-5" />
                  </span>
                  {isSidebarOpen && <span className="ml-3">Media Library</span>}
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 min-w-[20px]" />
              {isSidebarOpen && <span className="ml-3">Log Out</span>}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Sticky Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-8 justify-between flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm font-medium text-slate-500">
              {getBreadcrumb().split(' / ').map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span className={i === arr.length - 1 ? 'text-slate-900 font-semibold' : ''}>
                    {part}
                  </span>
                  {i < arr.length - 1 && <span className="mx-2 text-slate-300">/</span>}
                </React.Fragment>
              ))}
            </div>
            {activeSectionId !== 'media_library' && <StatusBadge status={status} />}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-slate-300 focus:ring-0 transition-all w-48"
              />
            </div>
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              View Site
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            
            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            {/* Global Context-Powered Save Buttons */}
            {activeSectionId !== 'media_library' && (
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {hasUnsavedChanges && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-sm text-amber-600 font-medium mr-2"
                    >
                      Unsaved changes
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => onSave(false)}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`relative flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isSaving ? 'bg-slate-100 text-slate-400' : hasUnsavedChanges ? 'bg-white border border-slate-200 shadow-sm hover:bg-slate-50' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Draft
                </button>
                <button
                  onClick={() => onSave(true)}
                  disabled={isSaving || (status === 'published' && !hasUnsavedChanges)}
                  className={`relative flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
                    isSaving || (status === 'published' && !hasUnsavedChanges) ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Publish
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 relative">
          <motion.div 
            key={activeSectionId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto pb-20"
          >
            {activeSectionId === 'media_library' ? (
              <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                <ImageIcon className="w-16 h-16 text-slate-200 mb-4" />
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Media Library</h2>
                <p className="text-slate-500 max-w-md">Global media management is coming soon. For now, you can upload media directly within each section editor.</p>
              </div>
            ) : (
              <ActiveComponent sectionId={activeSectionId} />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
