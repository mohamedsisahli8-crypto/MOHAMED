import React, { useEffect, useMemo, useState } from 'react';
import { Atom, BookMarked, Check, Copy, Globe2, Orbit, Search, Star } from 'lucide-react';
import { ENCYCLOPEDIA_ARTICLES } from '../data/encyclopedia';
import { ELEMENT_CATEGORY_LABELS, PERIODIC_ELEMENTS } from '../data/periodicTable';
import { FUNDAMENTAL_CONSTANTS, SOLAR_SYSTEM_PLANETS, WORLD_ATLAS } from '../data/planetsAndConstants';
import { t } from '../i18n/translations';
import { ChemicalElement, ElementCategory, EncyclopediaDiscipline, Language } from '../types/app';

interface EncyclopediaViewProps {
  lang: Language;
  initialSubTab?: string;
  initialDetailId?: string;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({
  lang,
  initialSubTab,
  initialDetailId,
  bookmarks,
  onToggleBookmark,
}) => {
  const copy = t(lang);
  const isAr = lang === 'ar';

  const [subTab, setSubTab] = useState<'articles' | 'periodic' | 'cosmos' | 'atlas'>(
    (initialSubTab as 'articles' | 'periodic' | 'cosmos' | 'atlas') || 'articles'
  );
  const [discipline, setDiscipline] = useState<EncyclopediaDiscipline>('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(PERIODIC_ELEMENTS[5]); // Carbon default
  const [elementSearch, setElementSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ElementCategory | 'all'>('all');

  // Solar system state
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [orbitTime, setOrbitTime] = useState(0);
  const [selectedPlanetId, setSelectedPlanetId] = useState('earth');
  const [earthWeightKg, setEarthWeightKg] = useState(70);

  // Atlas & Constants state
  const [atlasSearch, setAtlasSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialSubTab && ['articles', 'periodic', 'cosmos', 'atlas'].includes(initialSubTab)) {
      setSubTab(initialSubTab as 'articles' | 'periodic' | 'cosmos' | 'atlas');
    }
    if (initialDetailId) {
      const num = Number(initialDetailId);
      if (!Number.isNaN(num)) {
        const el = PERIODIC_ELEMENTS.find((e) => e.number === num);
        if (el) setSelectedElement(el);
      } else if (SOLAR_SYSTEM_PLANETS.some((p) => p.id === initialDetailId)) {
        setSelectedPlanetId(initialDetailId);
      }
    }
  }, [initialSubTab, initialDetailId]);

  // Orbital animation loop
  useEffect(() => {
    if (subTab !== 'cosmos' || orbitSpeed === 0) return;
    let frameId: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setOrbitTime((prev) => prev + dt * orbitSpeed * 0.45);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [subTab, orbitSpeed]);

  const filteredArticles = useMemo(() => {
    const q = articleSearch.trim().toLowerCase();
    return ENCYCLOPEDIA_ARTICLES.filter((a) => {
      if (discipline !== 'all' && a.discipline !== discipline) return false;
      if (!q) return true;
      return (
        a.titleAr.includes(q) ||
        a.titleEn.toLowerCase().includes(q) ||
        a.summaryAr.includes(q) ||
        a.summaryEn.toLowerCase().includes(q)
      );
    });
  }, [discipline, articleSearch]);

  const filteredElements = useMemo(() => {
    const q = elementSearch.trim().toLowerCase();
    return PERIODIC_ELEMENTS.filter((el) => {
      if (categoryFilter !== 'all' && el.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        el.nameAr.includes(q) ||
        el.nameEn.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number) === q
      );
    });
  }, [elementSearch, categoryFilter]);

  const selectedPlanet = useMemo(
    () => SOLAR_SYSTEM_PLANETS.find((p) => p.id === selectedPlanetId) || SOLAR_SYSTEM_PLANETS[2],
    [selectedPlanetId]
  );

  const filteredAtlas = useMemo(() => {
    const q = atlasSearch.trim().toLowerCase();
    if (!q) return WORLD_ATLAS;
    return WORLD_ATLAS.filter(
      (c) =>
        c.nameAr.includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.capitalAr.includes(q) ||
        c.capitalEn.toLowerCase().includes(q)
    );
  }, [atlasSearch]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'articles', label: copy.encyclopediaTabs.articles, icon: <BookMarked className="w-4 h-4" /> },
            { id: 'periodic', label: copy.encyclopediaTabs.periodic, icon: <Atom className="w-4 h-4" /> },
            { id: 'cosmos', label: copy.encyclopediaTabs.cosmos, icon: <Orbit className="w-4 h-4" /> },
            { id: 'atlas', label: copy.encyclopediaTabs.atlas, icon: <Globe2 className="w-4 h-4" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`min-h-[40px] px-4 py-2 flex items-center gap-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              subTab === tab.id
                ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: 8-DISCIPLINE ENCYCLOPEDIA */}
      {subTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(copy.disciplines) as EncyclopediaDiscipline[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiscipline(d)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    discipline === d
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-500'
                      : 'bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-500'
                  }`}
                >
                  {copy.disciplines[d]}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder={isAr ? 'تصفية المقالات...' : 'Filter articles...'}
                className="w-full min-h-[40px] ps-9 pe-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((art) => {
              const isBookmarked = bookmarks.includes(art.id);
              return (
                <article
                  key={art.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {copy.disciplines[art.discipline]} · {isAr ? art.eraOrDomainAr : art.eraOrDomainEn}
                        </div>
                        <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                          {isAr ? art.titleAr : art.titleEn}
                        </h3>
                        <p className="text-xs font-medium text-sky-600 dark:text-cyan-400 mt-0.5">
                          {isAr ? art.subtitleAr : art.subtitleEn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(art.id)}
                        aria-label={isAr ? 'حفظ في المفضلة' : 'Bookmark article'}
                        className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {isAr ? art.summaryAr : art.summaryEn}
                    </p>

                    {art.keyLaws.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {isAr ? 'القوانين والمعادلات الأساسية' : 'Key Equations & Principles'}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {art.keyLaws.map((law) => (
                            <div
                              key={law.formula}
                              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                            >
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {isAr ? law.nameAr : law.nameEn}
                              </span>
                              <code dir="ltr" className="font-mono text-xs sm:text-sm font-semibold text-sky-700 dark:text-cyan-300">
                                {law.formula}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    {(isAr ? art.factsAr : art.factsEn).map((fact, idx) => (
                      <p key={idx} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        • {fact}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE 118-ELEMENT PERIODIC TABLE */}
      {subTab === 'periodic' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-500'
                    : 'bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {isAr ? 'الكل (118)' : 'All (118)'}
              </button>
              {(Object.keys(ELEMENT_CATEGORY_LABELS) as ElementCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-opacity ${
                    ELEMENT_CATEGORY_LABELS[cat].colorClass
                  } ${categoryFilter !== 'all' && categoryFilter !== cat ? 'opacity-45' : ''}`}
                >
                  {isAr ? ELEMENT_CATEGORY_LABELS[cat].ar : ELEMENT_CATEGORY_LABELS[cat].en}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                placeholder={isAr ? 'ابحث باسم العنصر أو رمزه أو عدده...' : 'Search name, symbol, Z...'}
                className="w-full min-h-[40px] ps-9 pe-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Element Inspector & Bohr Atom SVG */}
            <div className="xl:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    Z = {selectedElement.number} · {isAr ? 'الدورة' : 'Period'} {selectedElement.period} · {isAr ? 'المجموعة' : 'Group'} {selectedElement.group}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {isAr ? selectedElement.nameAr : selectedElement.nameEn}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? selectedElement.nameEn : selectedElement.nameAr} · {isAr ? ELEMENT_CATEGORY_LABELS[selectedElement.category].ar : ELEMENT_CATEGORY_LABELS[selectedElement.category].en}
                  </div>
                </div>
                <div className={`px-3.5 py-2 rounded-xl border font-mono text-2xl font-bold ${ELEMENT_CATEGORY_LABELS[selectedElement.category].colorClass}`}>
                  {selectedElement.symbol}
                </div>
              </div>

              {/* Interactive Bohr Shell SVG */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <svg viewBox="0 0 220 220" className="w-44 h-44" aria-label="Bohr Atomic Model">
                  <circle cx="110" cy="110" r="14" fill="#0EA5E9" />
                  <text
                    x="110"
                    y="114"
                    textAnchor="middle"
                    className="fill-white text-[10px] font-mono font-bold"
                  >
                    {selectedElement.symbol}
                  </text>
                  {selectedElement.shells.map((electrons, shellIdx) => {
                    const radius = 24 + shellIdx * 12;
                    return (
                      <g key={shellIdx}>
                        <circle
                          cx="110"
                          cy="110"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          className="text-slate-300 dark:text-slate-700"
                          strokeWidth="1"
                        />
                        {Array.from({ length: electrons }).map((_, eIdx) => {
                          const angle = (eIdx / electrons) * Math.PI * 2 - Math.PI / 2;
                          const cx = 110 + radius * Math.cos(angle);
                          const cy = 110 + radius * Math.sin(angle);
                          return (
                            <circle
                              key={eIdx}
                              cx={cx}
                              cy={cy}
                              r="2.4"
                              className="fill-amber-500 dark:fill-cyan-400"
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums mt-1">
                  {isAr ? 'توزيع الإلكترونات:' : 'Shells:'} [{selectedElement.shells.join(' · ')}]
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr ? selectedElement.summaryAr : selectedElement.summaryEn}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isAr ? 'الكتلة الذرية' : 'Atomic Mass'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedElement.mass} u
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isAr ? 'الكهرسلبية' : 'Electronegativity'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedElement.electronegativity ?? '—'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isAr ? 'الانصهار (K)' : 'Melting (K)'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedElement.meltK ? `${selectedElement.meltK} K` : '—'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{isAr ? 'سنة الاكتشاف' : 'Discovered'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedElement.discoveredYear}
                  </div>
                </div>
              </div>
            </div>

            {/* 18-Column Desktop Table + Responsive Grid */}
            <div className="xl:col-span-8 space-y-4">
              {elementSearch.trim() === '' && categoryFilter === 'all' ? (
                <div className="overflow-x-auto pb-2" dir="ltr">
                  <div
                    className="grid gap-1 min-w-[820px]"
                    style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
                  >
                    {PERIODIC_ELEMENTS.map((el) => {
                      const active = selectedElement.number === el.number;
                      return (
                        <button
                          key={el.number}
                          type="button"
                          onClick={() => setSelectedElement(el)}
                          style={{ gridColumnStart: el.xPos, gridRowStart: el.yPos }}
                          className={`p-1.5 rounded-md border text-center transition-transform cursor-pointer ${
                            ELEMENT_CATEGORY_LABELS[el.category].colorClass
                          } ${active ? 'ring-2 ring-sky-500 dark:ring-cyan-400 scale-105 z-10' : 'hover:scale-105'}`}
                          title={`${el.number} ${el.nameEn} (${el.nameAr})`}
                        >
                          <div className="text-[9px] font-mono leading-none opacity-80 tabular-nums">{el.number}</div>
                          <div className="text-xs sm:text-sm font-mono font-bold leading-tight mt-0.5">{el.symbol}</div>
                          <div className="text-[8px] truncate opacity-85">{isAr ? el.nameAr : el.nameEn}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredElements.map((el) => (
                    <button
                      key={el.number}
                      type="button"
                      onClick={() => setSelectedElement(el)}
                      className={`p-3 rounded-xl border text-start transition-colors cursor-pointer ${
                        ELEMENT_CATEGORY_LABELS[el.category].colorClass
                      } ${selectedElement.number === el.number ? 'ring-2 ring-sky-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tabular-nums">{el.number}</span>
                        <span className="font-mono text-lg font-bold">{el.symbol}</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold truncate">{isAr ? el.nameAr : el.nameEn}</div>
                      <div className="text-xs font-mono opacity-80 tabular-nums">{el.mass} u</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOLAR SYSTEM SIMULATOR & GRAVITY LAB */}
      {subTab === 'cosmos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Orbital SVG Stage */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#07090E] border border-slate-800 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold">
                  {isAr ? 'محاكاة مدارات النظام الشمسي' : 'Live Solar System Orbital View'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'اضغط على أي كوكب لاستعراض خصائصه الفيزيائية' : 'Click any planet to inspect its astrophysical telemetry'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-300 flex items-center gap-2">
                  <span>{isAr ? 'السرعة:' : 'Speed:'}</span>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.25"
                    value={orbitSpeed}
                    onChange={(e) => setOrbitSpeed(Number(e.target.value))}
                    className="w-24 accent-cyan-400"
                  />
                  <span className="font-mono tabular-nums w-8">{orbitSpeed}x</span>
                </label>
              </div>
            </div>

            <svg viewBox="0 0 500 500" className="w-full max-w-[480px] mx-auto">
              {/* Sun */}
              <circle cx="250" cy="250" r="20" fill="#F59E0B" />
              <circle cx="250" cy="250" r="28" fill="#F59E0B" fillOpacity="0.18" />

              {SOLAR_SYSTEM_PLANETS.map((planet, idx) => {
                const orbitR = 44 + idx * 24;
                const angularVel = 365.25 / planet.orbitalDays;
                const angle = orbitTime * angularVel + idx * 0.9;
                const px = 250 + orbitR * Math.cos(angle);
                const py = 250 + orbitR * Math.sin(angle);
                const isSelected = selectedPlanet.id === planet.id;
                const planetSize = idx >= 4 ? 8 : 5.5;

                return (
                  <g
                    key={planet.id}
                    onClick={() => setSelectedPlanetId(planet.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="250"
                      cy="250"
                      r={orbitR}
                      fill="none"
                      stroke={isSelected ? '#38BDF8' : '#1E293B'}
                      strokeWidth={isSelected ? '1.5' : '1'}
                    />
                    {planet.hasRings && (
                      <ellipse
                        cx={px}
                        cy={py}
                        rx={planetSize * 1.9}
                        ry={planetSize * 0.65}
                        fill="none"
                        stroke="#CBD5E1"
                        strokeWidth="1.2"
                        opacity="0.7"
                      />
                    )}
                    <circle
                      cx={px}
                      cy={py}
                      r={planetSize}
                      fill={planet.color}
                      stroke={isSelected ? '#FFFFFF' : 'none'}
                      strokeWidth="2"
                    />
                    <text
                      x={px}
                      y={py - planetSize - 5}
                      textAnchor="middle"
                      className="fill-slate-300 text-[9px]"
                    >
                      {isAr ? planet.nameAr : planet.nameEn}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Planet Inspector & Gravity Weight Calculator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? selectedPlanet.typeAr : selectedPlanet.typeEn} · {selectedPlanet.distanceAU} AU
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {isAr ? selectedPlanet.nameAr : selectedPlanet.nameEn}
                  </h3>
                </div>
                <span
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                  style={{ backgroundColor: selectedPlanet.color }}
                />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr ? selectedPlanet.summaryAr : selectedPlanet.summaryEn}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500">{isAr ? 'الجاذبية السطحية' : 'Surface Gravity'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPlanet.gravityMs2} m/s²
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500">{isAr ? 'فترة الدوران المدارية' : 'Orbital Period'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPlanet.orbitalDays} {isAr ? 'يوم' : 'days'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500">{isAr ? 'متوسط الحرارة' : 'Mean Temp'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPlanet.meanTempC} °C
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500">{isAr ? 'الأقمار المؤكدة' : 'Confirmed Moons'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {selectedPlanet.moons}
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Across the Solar System */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? 'وزنك على كل كوكب' : 'Your Weight Across Planets'}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={earthWeightKg}
                    onChange={(e) => setEarthWeightKg(Math.max(1, Number(e.target.value) || 0))}
                    className="w-20 min-h-[36px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm text-center tabular-nums"
                  />
                  <span className="text-xs font-mono text-slate-500">kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SOLAR_SYSTEM_PLANETS.map((p) => {
                  const weight = ((earthWeightKg * p.gravityMs2) / 9.807).toFixed(1);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanetId(p.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer ${
                        selectedPlanet.id === p.id
                          ? 'border-sky-500 dark:border-cyan-400 bg-sky-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                      }`}
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {isAr ? p.nameAr : p.nameEn}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {weight} kg
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WORLD ATLAS & FUNDAMENTAL CONSTANTS VAULT */}
      {subTab === 'atlas' && (
        <div className="space-y-8">
          {/* Fundamental Constants Vault */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {isAr ? 'بنك الثوابت الفيزيائية والرياضية القياسية (SI)' : 'Fundamental Physical & Mathematical Constants'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isAr ? 'ثوابت مضبوطة وفق النظام الدولي للوحدات مع نسخ سريع للقيم' : 'SI-calibrated values with one-click copy'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {FUNDAMENTAL_CONSTANTS.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {isAr ? c.nameAr : c.nameEn}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? c.descriptionAr : c.descriptionEn}
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 shrink-0">
                      {c.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div dir="ltr" className="font-mono text-xs sm:text-sm font-semibold text-sky-700 dark:text-cyan-300 tabular-nums">
                      {c.value} <span className="text-slate-400">{c.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.id, c.value)}
                      className="min-h-[32px] px-2.5 py-1 flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === c.id ? copy.actions.copied : copy.actions.copy}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* World Nations Atlas */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {isAr ? 'أطلس الدول والعواصم والمناطق الزمنية' : 'World Nations, Capitals & Timezones Atlas'}
              </h3>
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="text"
                  value={atlasSearch}
                  onChange={(e) => setAtlasSearch(e.target.value)}
                  placeholder={isAr ? 'ابحث باسم الدولة أو العاصمة...' : 'Search country or capital...'}
                  className="w-full min-h-[40px] ps-9 pe-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
              <table className="w-full text-sm text-start">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'الدولة' : 'Country'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'العاصمة' : 'Capital'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'القارة' : 'Continent'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'السكان (مليون)' : 'Population (M)'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'المساحة (كم²)' : 'Area (km²)'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'العملة' : 'Currency'}</th>
                    <th className="py-3 px-4 text-start font-semibold">{isAr ? 'الوقت الآن' : 'Local Time'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAtlas.map((country) => {
                    const localTime = new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-GB', {
                      timeZone: country.timezone,
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date());
                    return (
                      <tr key={country.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {isAr ? country.nameAr : country.nameEn}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {isAr ? country.capitalAr : country.capitalEn}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {isAr ? country.continentAr : country.continentEn}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {country.populationM.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {country.areaKm2.toLocaleString('en-US')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {isAr ? country.currencyAr : country.currencyEn}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-medium text-sky-600 dark:text-cyan-400">
                          {localTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
