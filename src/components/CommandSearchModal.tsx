import React, { useMemo, useState } from 'react';
import { Atom, BookOpen, Globe2, Orbit, Search, Sparkles, X } from 'lucide-react';
import { ENCYCLOPEDIA_ARTICLES } from '../data/encyclopedia';
import { PERIODIC_ELEMENTS } from '../data/periodicTable';
import { FUNDAMENTAL_CONSTANTS, SOLAR_SYSTEM_PLANETS, WORLD_ATLAS } from '../data/planetsAndConstants';
import { Language, MainSection } from '../types/app';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (section: MainSection, subTab?: string, detailId?: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const isAr = lang === 'ar';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        elements: PERIODIC_ELEMENTS.slice(0, 6),
        articles: ENCYCLOPEDIA_ARTICLES.slice(0, 4),
        constants: FUNDAMENTAL_CONSTANTS.slice(0, 4),
        planets: SOLAR_SYSTEM_PLANETS.slice(0, 4),
        countries: WORLD_ATLAS.slice(0, 4),
      };
    }

    return {
      elements: PERIODIC_ELEMENTS.filter(
        (e) =>
          e.nameAr.includes(q) ||
          e.nameEn.toLowerCase().includes(q) ||
          e.symbol.toLowerCase() === q ||
          String(e.number) === q
      ).slice(0, 8),
      articles: ENCYCLOPEDIA_ARTICLES.filter(
        (a) =>
          a.titleAr.includes(q) ||
          a.titleEn.toLowerCase().includes(q) ||
          a.summaryAr.includes(q) ||
          a.summaryEn.toLowerCase().includes(q)
      ).slice(0, 6),
      constants: FUNDAMENTAL_CONSTANTS.filter(
        (c) =>
          c.nameAr.includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      ).slice(0, 6),
      planets: SOLAR_SYSTEM_PLANETS.filter(
        (p) => p.nameAr.includes(q) || p.nameEn.toLowerCase().includes(q)
      ).slice(0, 4),
      countries: WORLD_ATLAS.filter(
        (c) =>
          c.nameAr.includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.capitalAr.includes(q) ||
          c.capitalEn.toLowerCase().includes(q)
      ).slice(0, 5),
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث عن أي عنصر كيميائي، قانون فيزيائي، ثابت، كوكب، دولة...'
                : 'Search elements, laws, constants, planets, countries...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {results.elements.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" />
                <span>{isAr ? 'عناصر الجدول الدوري' : 'Periodic Elements'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.elements.map((el) => (
                  <button
                    key={el.number}
                    type="button"
                    onClick={() => {
                      onNavigate('encyclopedia', 'periodic', String(el.number));
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-cyan-400 text-start transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {isAr ? el.nameAr : el.nameEn}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        Z={el.number} · {el.mass} u
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold text-sky-600 dark:text-cyan-400">
                      {el.symbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.articles.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'مقالات الموسوعة' : 'Encyclopedia Articles'}</span>
              </div>
              <div className="space-y-1.5">
                {results.articles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      onNavigate('encyclopedia', 'articles', art.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-cyan-400 text-start transition-colors cursor-pointer"
                  >
                    <div className="truncate">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {isAr ? art.titleAr : art.titleEn}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {isAr ? art.subtitleAr : art.subtitleEn}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.constants.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'الثوابت الفيزيائية والرياضية' : 'Fundamental Constants'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.constants.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onNavigate('encyclopedia', 'atlas', c.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-cyan-400 text-start transition-colors cursor-pointer"
                  >
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {isAr ? c.nameAr : c.nameEn}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {c.value} {c.unit}
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 ms-2">
                      {c.symbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(results.planets.length > 0 || results.countries.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.planets.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Orbit className="w-3.5 h-3.5" />
                    <span>{isAr ? 'النظام الشمسي' : 'Solar System'}</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.planets.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onNavigate('encyclopedia', 'cosmos', p.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 text-start text-sm cursor-pointer"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">
                          {isAr ? p.nameAr : p.nameEn}
                        </span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {p.distanceAU} AU
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.countries.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أطلس الدول' : 'World Atlas'}</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.countries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onNavigate('encyclopedia', 'atlas', c.code);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 text-start text-sm cursor-pointer"
                      >
                        <span className="font-medium text-slate-900 dark:text-white">
                          {isAr ? c.nameAr : c.nameEn}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isAr ? c.capitalAr : c.capitalEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
