import React from 'react';
import { Globe, Moon, Search, Sun, Wifi, WifiOff } from 'lucide-react';
import { t } from '../i18n/translations';
import { Language, Theme } from '../types/app';

interface WorkspaceBarProps {
  lang: Language;
  theme: Theme;
  isOnline: boolean;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const WorkspaceBar: React.FC<WorkspaceBarProps> = ({
  lang,
  theme,
  isOnline,
  onToggleLang,
  onToggleTheme,
  onOpenSearch,
}) => {
  const copy = t(lang);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0B0E17]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Universal Command Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex-1 min-w-[220px] max-w-xl min-h-[40px] px-3.5 py-2 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-sky-500 dark:hover:border-cyan-500 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="truncate">{copy.actions.searchPlaceholder}</span>
          </span>
          <kbd className="hidden sm:inline-block font-mono text-xs text-slate-400 shrink-0">
            Ctrl+K
          </kbd>
        </button>

        {/* Right Utility Controls: Connectivity, Language, Theme */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-2">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            <span>{isOnline ? copy.actions.online : copy.actions.offline}</span>
          </span>

          <button
            type="button"
            onClick={onToggleLang}
            className="min-h-[40px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[40px] min-w-[40px] px-3 py-1.5 flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'التبديل إلى الوضع الداكن'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span className="hidden sm:inline">{theme === 'dark' ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
