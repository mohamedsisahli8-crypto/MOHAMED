import React from 'react';
import { BookOpen, Calculator, Compass, FlaskConical, Wrench } from 'lucide-react';
import { t } from '../i18n/translations';
import { Language, MainSection } from '../types/app';

interface NavbarProps {
  lang: Language;
  activeSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onOpenInstallModal: () => void;
  onInstallClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  activeSection,
  onSelectSection,
  isInstallable,
  isInstalled,
  onOpenInstallModal,
  onInstallClick,
}) => {
  const copy = t(lang);

  const navItems: { id: MainSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: copy.nav.overview, icon: <Compass className="w-5 h-5" /> },
    { id: 'encyclopedia', label: copy.nav.encyclopedia, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'labs', label: copy.nav.labs, icon: <FlaskConical className="w-5 h-5" /> },
    { id: 'calculators', label: copy.nav.calculators, icon: <Calculator className="w-5 h-5" /> },
    { id: 'toolkit', label: copy.nav.toolkit, icon: <Wrench className="w-5 h-5" /> },
  ];

  const handlePrimaryAction = () => {
    if (isInstallable) {
      onInstallClick();
    } else {
      onOpenInstallModal();
    }
  };

  return (
    <>
      {/* Desktop & Mobile Top Header — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectSection('overview')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {copy.brand}
          </button>

          {/* Zone 2: 5 Concise Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`py-1.5 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-sky-600 dark:border-cyan-400 text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isInstalled
                ? copy.actions.installed
                : isInstallable
                ? copy.actions.installApp
                : copy.actions.openAppInfo}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar — Natural Thumb Zone (under 15% viewport height) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0E17]/95 backdrop-blur-md"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] text-[10px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'text-sky-600 dark:text-cyan-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.icon}
                <span className="truncate max-w-[68px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
