'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminSections, homeSections, standaloneSections, globalSections } from './sections/config';
import { apiClient } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Image as ImageIcon,
  Settings, Users, Moon, Sun, Monitor, Link, Star,
  LogOut, PanelLeftClose, PanelLeftOpen, Search, ExternalLink, Loader2,
  ChevronRight, Home
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
  'settings': <Settings className="w-5 h-5" />,
  'star': <Star className="w-5 h-5" />,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [homeOpen, setHomeOpen] = useState(true);
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
    if (activeSection.group === 'home') return `Dashboard / Pages / Home / ${activeSection.title}`;
    return `Dashboard / ${activeSection.title}`;
  };

  const renderSidebarItem = (section: typeof adminSections[0], indented = false) => {
    const isActive = activeSectionId === section.id;
    return (
      <li key={section.id}>
        <button
          onClick={() => setActiveSectionId(section.id)}
          className={`w-full flex items-center ${indented ? 'pl-10' : 'px-3'} pr-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
            isActive
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
          }`}
        >
          {isActive && isSidebarOpen && <motion.div layoutId="active-indicator" className="absolute left-3 w-1 h-5 bg-white rounded-full" />}
          <span className={`mr-3 opacity-70 ${!isSidebarOpen && !indented && 'mx-auto'}`}>
            {iconMap[section.icon] || <FileText className="w-4 h-4" />}
          </span>
          {isSidebarOpen && section.title}
        </button>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.aside
          initial={{ width: isSidebarOpen ? 280 : 80 }}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-[#0A0A0A] text-zinc-400 flex-shrink-0 flex flex-col shadow-xl z-20 border-r border-zinc-800/50"
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="font-bold text-black tracking-tight">TBS</span>
                </div>
                <h2 className="text-sm font-semibold tracking-wide text-white">WORKSPACE</h2>
              </motion.div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5 mx-auto" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
            <ul className="space-y-1 px-3">

              {/* ── Pages Label ── */}
              <li>
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {isSidebarOpen ? 'Pages' : <FileText className="w-5 h-5 mx-auto" />}
                </div>
              </li>

              {/* ── Home Group (collapsible) ── */}
              <li>
                <button
                  onClick={() => setHomeOpen(!homeOpen)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white rounded-lg transition-colors"
                >
                  <span className="mr-3 opacity-70">
                    <Home className="w-5 h-5" />
                  </span>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Home</span>
                      <motion.div animate={{ rotate: homeOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </motion.div>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {homeOpen && isSidebarOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 space-y-1 overflow-hidden"
                    >
                      {homeSections.map((section) => renderSidebarItem(section, true))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li className="my-3 border-t border-zinc-800/50"></li>

              {/* ── Standalone Sections (Articles) ── */}
              {standaloneSections.map((section) => renderSidebarItem(section, false))}

              <li className="my-3 border-t border-zinc-800/50"></li>

              {/* ── Global Sections (Footer) ── */}
              {globalSections.map((section) => renderSidebarItem(section, false))}

            </ul>
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
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
        <header className="bg-[#0A0A0A]/90 backdrop-blur-md border-b border-zinc-800/50 h-16 flex items-center px-8 justify-between flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm font-medium text-zinc-400">
              {getBreadcrumb().split(' / ').map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span className={i === arr.length - 1 ? 'text-white font-semibold' : ''}>
                    {part}
                  </span>
                  {i < arr.length - 1 && <span className="mx-2 text-zinc-600">/</span>}
                </React.Fragment>
              ))}
            </div>
            {activeSectionId !== 'media_library' && <StatusBadge status={status} />}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-zinc-900 border border-transparent rounded-lg text-sm text-white focus:bg-zinc-900 focus:border-zinc-700 focus:ring-0 transition-all w-48 placeholder-zinc-500"
              />
            </div>
            <a
              href="/"
              target="_blank"
              className="flex items-center px-4 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              View Site
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>

            <div className="w-px h-6 bg-zinc-800 mx-1"></div>

            {/* Global Context-Powered Save Buttons */}
            {activeSectionId !== 'media_library' && (
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {hasUnsavedChanges && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-sm text-zinc-400 font-medium mr-2"
                    >
                      Unsaved changes
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => onSave(false)}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`relative flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSaving ? 'bg-zinc-900 text-zinc-600' : hasUnsavedChanges ? 'bg-black border border-zinc-700 text-white hover:bg-zinc-900' : 'bg-black border border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Draft
                </button>
                <button
                  onClick={() => onSave(true)}
                  disabled={isSaving || (status === 'published' && !hasUnsavedChanges)}
                  className={`relative flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSaving || (status === 'published' && !hasUnsavedChanges) ? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:bg-zinc-200'
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
              <div className="flex flex-col items-center justify-center p-16 bg-[#111111] rounded-2xl border border-dashed border-zinc-800 text-center">
                <ImageIcon className="w-16 h-16 text-zinc-700 mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Media Library</h2>
                <p className="text-zinc-400 max-w-md">Global media management is coming soon. For now, you can upload media directly within each section editor.</p>
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
