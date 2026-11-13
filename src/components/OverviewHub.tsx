import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  Calendar,
  Code2,
  Compass,
  FlaskConical,
  Orbit,
  Sparkles,
} from 'lucide-react';
import { t } from '../i18n/translations';
import { Language, MainSection } from '../types/app';

interface OverviewHubProps {
  lang: Language;
  onNavigate: (section: MainSection, subTab?: string) => void;
  onOpenInstallModal: () => void;
}

export const OverviewHub: React.FC<OverviewHubProps> = ({
  lang,
  onNavigate,
  onOpenInstallModal,
}) => {
  const copy = t(lang);
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [heroImgError, setHeroImgError] = useState(false);
  const [crystalImgError, setCrystalImgError] = useState(false);
  const [earthImgError, setEarthImgError] = useState(false);

  const modules: {
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    section: MainSection;
    subTab: string;
    icon: React.ReactNode;
  }[] = [
    {
      titleAr: 'الجدول الدوري التفاعلي (118)',
      titleEn: 'Complete Periodic Table (118)',
      descAr: 'جميع العناصر الكيميائية الـ 118 مع نموذج ذرة بور والإلكترونات والخواص الحرارية.',
      descEn: 'All 118 chemical elements with live SVG Bohr electron shells and physical constants.',
      section: 'encyclopedia',
      subTab: 'periodic',
      icon: <Atom className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
    {
      titleAr: 'راسم الدوال والتفاضل والتكامل',
      titleEn: 'Function Plotter & Calculus',
      descAr: 'رسم حي للمعادلات الرياضية مع حساب المشتقة الأولى والتكامل المحدود فوريّاً.',
      descEn: 'Interactive mathematical equation plotter with live derivative and definite integral.',
      section: 'labs',
      subTab: 'grapher',
      icon: <FlaskConical className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
    {
      titleAr: 'المجموعة الشمسية والجاذبية',
      titleEn: 'Solar System & Gravity Lab',
      descAr: 'محاكاة مدارية حية للكواكب الثمانية وحساب وزنك على كل كوكب.',
      descEn: 'Animated planetary orbital model and real-time surface gravity weight comparison.',
      section: 'encyclopedia',
      subTab: 'cosmos',
      icon: <Orbit className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
    {
      titleAr: 'الحاسبة العلمية ومحول 14 وحدة',
      titleEn: 'Scientific Calc & 14-Unit Converter',
      descAr: 'حاسبة دوال مثلثية ولوغاريتمية وتحويل فوري للطول والكتلة والطاقة والبيانات.',
      descEn: 'Full trig/log scientific calculator and bidirectional 14-category unit conversion.',
      section: 'calculators',
      subTab: 'scientific',
      icon: <Calculator className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
    {
      titleAr: 'التقويم الهجري والساعة العالمية',
      titleEn: 'Hijri Calendar & World Clock',
      descAr: 'محول دقيق بين التاريخ الهجري والميلادي وتوقيت العواصم العالمية حيّاً.',
      descEn: 'Accurate Hijri-Gregorian converter and live world capital timezones.',
      section: 'calculators',
      subTab: 'calendarClock',
      icon: <Calendar className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
    {
      titleAr: 'أدوات المطور، الملاحظات والاختبار',
      titleEn: 'Dev Studio, Notes & Quiz',
      descAr: 'تشفير SHA-256، تنسيق JSON، محرر ماركداون، مؤقت بومودورو، واختبار معرفي.',
      descEn: 'JSON/Regex/Hash toolkit, offline Notes & Pomodoro, and multi-domain science quiz.',
      section: 'toolkit',
      subTab: 'devTools',
      icon: <Code2 className="w-5 h-5 text-sky-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
          <div className="space-y-5">
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {copy.hero.kicker}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-tight text-slate-900 dark:text-white">
              {copy.hero.title}
            </h1>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              {copy.hero.subtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('encyclopedia', 'articles')}
              className="min-h-[44px] px-5 py-2.5 flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{copy.hero.primaryCta}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('labs', 'grapher')}
              className="min-h-[44px] px-5 py-2.5 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors cursor-pointer"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{copy.hero.secondaryCta}</span>
            </button>

            <button
              type="button"
              onClick={onOpenInstallModal}
              className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-sky-700 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              {isAr ? 'دليل التشغيل كتطبيق مستقل' : 'Official App Launch Guide'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[260px]">
          {heroImgError ? (
            <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-[#0B1120] to-sky-950 text-slate-200">
              <Compass className="w-16 h-16 text-cyan-400 mb-3" />
              <span className="font-display font-semibold text-base">
                {isAr ? 'الأسطرلاب العلمي والكوني' : 'Scientific Armillary Observatory'}
              </span>
            </div>
          ) : (
            <img
              src="/src/assets/images/hero_cosmos_astrolabe_1794601400651.jpg"
              alt={isAr ? 'نموذج علمي للأسطرلاب والمدارات الكونية' : 'Precision brass armillary sphere and orbital geometry'}
              referrerPolicy="no-referrer"
              onError={() => setHeroImgError(true)}
              className="w-full h-full lg:h-full object-cover"
            />
          )}
        </div>
      </section>

      {/* 4-Column Full-Width Metric Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'العناصر الكيميائية' : 'Chemical Elements'}
          </div>
          <div className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            118
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'من الهيدروجين إلى الأوغانيسون' : 'Hydrogen (Z=1) to Oganesson (Z=118)'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'فروع المعرفة والموسوعة' : 'Knowledge Disciplines'}
          </div>
          <div className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            8
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'فيزياء · رياضيات · أحياء · تاريخ · حوسبة' : 'Physics · Math · Bio · History · CS'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'فئات تحويل الوحدات' : 'Unit Conversion Categories'}
          </div>
          <div className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            14
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'طول · كتلة · طاقة · ضغط · بيانات' : 'Length · Mass · Energy · Pressure · Data'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'العمل دون إنترنت' : 'Offline Availability'}
          </div>
          <div className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums">
            100%
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'تطبيق PWA مستقل مع تخزين محلي' : 'Standalone PWA & local vault'}
          </div>
        </div>
      </section>

      {/* Featured Visual Gateways */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onNavigate('encyclopedia', 'periodic')}
          className="group text-start rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-sky-500 dark:hover:border-cyan-400 transition-colors cursor-pointer"
        >
          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900">
            {crystalImgError ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-cyan-400">
                <Atom className="w-12 h-12" />
              </div>
            ) : (
              <img
                src="/src/assets/images/science_molecular_crystal_1794601400200.jpg"
                alt={isAr ? 'البنية البلورية الجزيئية' : 'Crystalline molecular lattice'}
                referrerPolicy="no-referrer"
                onError={() => setCrystalImgError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            )}
          </div>
          <div className="p-6">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'الكيمياء والفيزياء الذرية · 118 عنصراً' : 'Chemistry & Atomic Physics · 118 Elements'}
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'مستكشف العناصر والتركيب الذري' : 'Periodic Table & Atomic Shell Explorer'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {isAr
                ? 'تصفّح الجدول الدوري الكامل وافحص المدارات الإلكترونية ونقاط الانصهار والغليان لكل عنصر.'
                : 'Inspect every element across all 18 groups with interactive Bohr electron shells and thermal properties.'}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('encyclopedia', 'cosmos')}
          className="group text-start rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-sky-500 dark:hover:border-cyan-400 transition-colors cursor-pointer"
        >
          <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900">
            {earthImgError ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-cyan-400">
                <Orbit className="w-12 h-12" />
              </div>
            ) : (
              <img
                src="/src/assets/images/science_earth_biosphere_1794601400829.jpg"
                alt={isAr ? 'طبقات الأرض والغلاف الجوي' : 'Planetary atmospheric and tectonic layers'}
                referrerPolicy="no-referrer"
                onError={() => setEarthImgError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            )}
          </div>
          <div className="p-6">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'الفلك وعلوم الأرض · مدارات حية' : 'Astronomy & Planetary Science · Live Orbits'}
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'المجموعة الشمسية وطبقات الكوكب' : 'Solar System Simulator & Planetary Atlas'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {isAr
                ? 'شاهد حركة الكواكب الفورية حول الشمس وقارن الجاذبية ودرجات الحرارة والأقمار.'
                : 'Simulate planetary orbits in real time and compare surface gravity, temperatures, and moons.'}
            </p>
          </div>
        </button>
      </section>

      {/* Universal Modules Directory */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'الأقسام والأدوات المتكاملة' : 'All Integrated Modules'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'اختر أي وحدة للانتقال المباشر والعمل دون اتصال' : 'Select any module for direct offline-ready operation'}
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-sky-600 dark:text-cyan-400 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.titleEn}
              type="button"
              onClick={() => onNavigate(mod.section, mod.subTab)}
              className="text-start p-5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-cyan-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                {mod.icon}
                <ArrowIcon className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {isAr ? mod.titleAr : mod.titleEn}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr ? mod.descAr : mod.descEn}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
