/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CalculatorsView } from './components/CalculatorsView';
import { CommandSearchModal } from './components/CommandSearchModal';
import { EncyclopediaView } from './components/EncyclopediaView';
import { InstallAppModal } from './components/InstallAppModal';
import { Navbar } from './components/Navbar';
import { OverviewHub } from './components/OverviewHub';
import { ScienceLabsView } from './components/ScienceLabsView';
import { ToolkitWorkspaceView } from './components/ToolkitWorkspaceView';
import { WorkspaceBar } from './components/WorkspaceBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import { t } from './i18n/translations';
import { Language, MainSection, NoteItem, TaskItem, Theme } from './types/app';

export default function App() {
  const [lang, setLang] = useLocalStorage<Language>('almawsouah_lang', 'ar');
  const [theme, setTheme] = useLocalStorage<Theme>('almawsouah_theme', 'dark');
  const [activeSection, setActiveSection] = useState<MainSection>('overview');
  const [subTab, setSubTab] = useState<string | undefined>(undefined);
  const [detailId, setDetailId] = useState<string | undefined>(undefined);

  const [searchOpen, setSearchOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('almawsouah_bookmarks', ['relativity']);
  const [notes, setNotes] = useLocalStorage<NoteItem[]>('almawsouah_notes', [
    {
      id: 'welcome-note',
      title: 'ملاحظة البداية · Welcome Note',
      content: 'جميع معارفك وملاحظاتك تُحفظ محلياً وتعمل دون الحاجة لاتصال بالإنترنت.',
      updatedAt: new Date().toISOString(),
      category: 'general',
    },
  ]);
  const [tasks, setTasks] = useLocalStorage<TaskItem[]>('almawsouah_tasks', [
    {
      id: 'welcome-task',
      title: 'استكشاف الجدول الدوري الكامل (118 عنصراً)',
      done: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
  ]);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const copy = t(lang);

  // Sync HTML lang, dir, and dark class
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Global Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setInstallModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (section: MainSection, nextSubTab?: string, nextDetailId?: string) => {
    setActiveSection(section);
    setSubTab(nextSubTab);
    setDetailId(nextDetailId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleExportBackup = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks,
      notes,
      tasks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `al-mawsuah-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.bookmarks)) setBookmarks(parsed.bookmarks);
      if (Array.isArray(parsed.notes)) setNotes(parsed.notes);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
    } catch {
      // Ignore malformed JSON gracefully
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#07090E] dark:text-slate-100 pb-16 md:pb-0">
      <Navbar
        lang={lang}
        activeSection={activeSection}
        onSelectSection={(sec) => handleNavigate(sec)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onOpenInstallModal={() => setInstallModalOpen(true)}
        onInstallClick={() => {
          void install();
        }}
      />

      <WorkspaceBar
        lang={lang}
        theme={theme}
        isOnline={isOnline}
        onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))}
        onToggleTheme={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeSection === 'overview' && (
          <OverviewHub
            lang={lang}
            onNavigate={handleNavigate}
            onOpenInstallModal={() => setInstallModalOpen(true)}
          />
        )}

        {activeSection === 'encyclopedia' && (
          <EncyclopediaView
            lang={lang}
            initialSubTab={subTab}
            initialDetailId={detailId}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeSection === 'labs' && (
          <ScienceLabsView lang={lang} initialSubTab={subTab} />
        )}

        {activeSection === 'calculators' && (
          <CalculatorsView lang={lang} initialSubTab={subTab} />
        )}

        {activeSection === 'toolkit' && (
          <ToolkitWorkspaceView
            lang={lang}
            initialSubTab={subTab}
            notes={notes}
            setNotes={setNotes}
            tasks={tasks}
            setTasks={setTasks}
            bookmarks={bookmarks}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {lang === 'ar'
              ? 'موسوعة العلم الشاملة · تطبيق معرفي وعلمي مستقل يعمل دون اتصال'
              : "Al-Mawsu'ah Universal · Standalone Offline-Ready Knowledge App"}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setInstallModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              {copy.actions.openAppInfo}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white underline-offset-4 hover:underline cursor-pointer"
            >
              {copy.actions.quickSearch}
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Status Toast when disconnected */}
      {!isOnline && (
        <div className="fixed bottom-16 md:bottom-4 start-4 z-50 px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-medium shadow-lg">
          {copy.actions.offline}
        </div>
      )}

      <CommandSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
        onNavigate={handleNavigate}
      />

      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        lang={lang}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onInstall={install}
      />
    </div>
  );
}
