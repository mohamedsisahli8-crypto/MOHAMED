import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, Calendar, Clock, HeartPulse, Scale } from 'lucide-react';
import { t } from '../i18n/translations';
import { Language } from '../types/app';
import { compileMathExpression, factorial } from '../utils/mathParser';

interface CalculatorsViewProps {
  lang: Language;
  initialSubTab?: string;
}

type CalcTab = 'scientific' | 'units' | 'healthFinance' | 'calendarClock';

interface UnitDef {
  id: string;
  ar: string;
  en: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNIT_CATEGORIES: {
  id: string;
  ar: string;
  en: string;
  units: UnitDef[];
}[] = [
  {
    id: 'length',
    ar: 'الطول',
    en: 'Length',
    units: [
      { id: 'm', ar: 'متر (m)', en: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', ar: 'كيلومتر (km)', en: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', ar: 'سنتيمتر (cm)', en: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', ar: 'مليمتر (mm)', en: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', ar: 'ميل (mi)', en: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'ft', ar: 'قدم (ft)', en: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', ar: 'بوصة (in)', en: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    id: 'mass',
    ar: 'الكتلة',
    en: 'Mass',
    units: [
      { id: 'kg', ar: 'كيلوغرام (kg)', en: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', ar: 'غرام (g)', en: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'ton', ar: 'طن متري (t)', en: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'lb', ar: 'رطل (lb)', en: 'Pound (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', ar: 'أونصة (oz)', en: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    ],
  },
  {
    id: 'temperature',
    ar: 'الحرارة',
    en: 'Temperature',
    units: [
      { id: 'c', ar: 'مئوية (°C)', en: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', ar: 'فهرنهايت (°F)', en: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', ar: 'كلفن (K)', en: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'time',
    ar: 'الزمن',
    en: 'Time',
    units: [
      { id: 's', ar: 'ثانية (s)', en: 'Second (s)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', ar: 'دقيقة (min)', en: 'Minute (min)', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'h', ar: 'ساعة (h)', en: 'Hour (h)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'd', ar: 'يوم (d)', en: 'Day (d)', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'y', ar: 'سنة (365.25d)', en: 'Year', toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
    ],
  },
  {
    id: 'area',
    ar: 'المساحة',
    en: 'Area',
    units: [
      { id: 'm2', ar: 'متر مربع (m²)', en: 'Square Meter (m²)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', ar: 'كيلومتر مربع (km²)', en: 'Square Km (km²)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'ha', ar: 'هكتار (ha)', en: 'Hectare (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'acre', ar: 'فدان إنجليزي (acre)', en: 'Acre', toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
    ],
  },
  {
    id: 'volume',
    ar: 'الحجم',
    en: 'Volume',
    units: [
      { id: 'l', ar: 'لتر (L)', en: 'Liter (L)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', ar: 'ملليلتر (mL)', en: 'Milliliter (mL)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'm3', ar: 'متر مكعب (m³)', en: 'Cubic Meter (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'gal', ar: 'غالون أمريكي (gal)', en: 'US Gallon (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    ],
  },
  {
    id: 'speed',
    ar: 'السرعة',
    en: 'Speed',
    units: [
      { id: 'ms', ar: 'متر/ثانية (m/s)', en: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kmh', ar: 'كم/ساعة (km/h)', en: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', ar: 'ميل/ساعة (mph)', en: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'mach', ar: 'ماخ (Mach)', en: 'Mach', toBase: (v) => v * 343, fromBase: (v) => v / 343 },
    ],
  },
  {
    id: 'pressure',
    ar: 'الضغط',
    en: 'Pressure',
    units: [
      { id: 'pa', ar: 'باسكال (Pa)', en: 'Pascal (Pa)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kpa', ar: 'كيلوباسكال (kPa)', en: 'Kilopascal (kPa)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'bar', ar: 'بار (bar)', en: 'Bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      { id: 'atm', ar: 'ضغط جوي (atm)', en: 'Atmosphere (atm)', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      { id: 'psi', ar: 'رطل/بوصة² (psi)', en: 'PSI', toBase: (v) => v * 6894.757, fromBase: (v) => v / 6894.757 },
    ],
  },
  {
    id: 'energy',
    ar: 'الطاقة',
    en: 'Energy',
    units: [
      { id: 'j', ar: 'جول (J)', en: 'Joule (J)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kj', ar: 'كيلوجول (kJ)', en: 'Kilojoule (kJ)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'kcal', ar: 'سعر حراري كبير (kcal)', en: 'Kilocalorie (kcal)', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      { id: 'kwh', ar: 'كيلوواط·ساعة (kWh)', en: 'kWh', toBase: (v) => v * 3600000, fromBase: (v) => v / 3600000 },
    ],
  },
  {
    id: 'power',
    ar: 'القدرة',
    en: 'Power',
    units: [
      { id: 'w', ar: 'واط (W)', en: 'Watt (W)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kw', ar: 'كيلوواط (kW)', en: 'Kilowatt (kW)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'hp', ar: 'حصان ميكانيكي (hp)', en: 'Horsepower (hp)', toBase: (v) => v * 745.7, fromBase: (v) => v / 745.7 },
    ],
  },
  {
    id: 'data',
    ar: 'سعة البيانات',
    en: 'Data Storage',
    units: [
      { id: 'b', ar: 'بايت (B)', en: 'Byte (B)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', ar: 'كيلوبايت (KB)', en: 'Kilobyte (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', ar: 'ميجابايت (MB)', en: 'Megabyte (MB)', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { id: 'gb', ar: 'جيجابايت (GB)', en: 'Gigabyte (GB)', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      { id: 'tb', ar: 'تيرابايت (TB)', en: 'Terabyte (TB)', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    ],
  },
  {
    id: 'bandwidth',
    ar: 'سرعة الشبكة',
    en: 'Data Rate',
    units: [
      { id: 'mbps', ar: 'ميجابت/ث (Mbps)', en: 'Mbps', toBase: (v) => v, fromBase: (v) => v },
      { id: 'gbps', ar: 'جيجابت/ث (Gbps)', en: 'Gbps', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'mbs', ar: 'ميجابايت/ث (MB/s)', en: 'MB/s', toBase: (v) => v * 8, fromBase: (v) => v / 8 },
    ],
  },
  {
    id: 'angle',
    ar: 'الزاوية',
    en: 'Angle',
    units: [
      { id: 'deg', ar: 'درجة (°)', en: 'Degree (°)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'rad', ar: 'راديان (rad)', en: 'Radian (rad)', toBase: (v) => (v * 180) / Math.PI, fromBase: (v) => (v * Math.PI) / 180 },
      { id: 'grad', ar: 'غراد (grad)', en: 'Gradian', toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 },
    ],
  },
  {
    id: 'frequency',
    ar: 'التردد',
    en: 'Frequency',
    units: [
      { id: 'hz', ar: 'هرتز (Hz)', en: 'Hertz (Hz)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'khz', ar: 'كيلوهرتز (kHz)', en: 'Kilohertz (kHz)', toBase: (v) => v * 1e3, fromBase: (v) => v / 1e3 },
      { id: 'mhz', ar: 'ميجاهرتز (MHz)', en: 'Megahertz (MHz)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'ghz', ar: 'جيجاهرتز (GHz)', en: 'Gigahertz (GHz)', toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
    ],
  },
];

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ lang, initialSubTab }) => {
  const copy = t(lang);
  const isAr = lang === 'ar';

  const [tab, setTab] = useState<CalcTab>((initialSubTab as CalcTab) || 'scientific');

  useEffect(() => {
    if (initialSubTab && ['scientific', 'units', 'healthFinance', 'calendarClock'].includes(initialSubTab)) {
      setTab(initialSubTab as CalcTab);
    }
  }, [initialSubTab]);

  // 1. Scientific Calculator State
  const [calcExpr, setCalcExpr] = useState('sin(30) + sqrt(144)');
  const [useDegrees, setUseDegrees] = useState(true);
  const [calcHistory, setCalcHistory] = useState<{ expr: string; result: string }[]>([]);

  const calcPreview = useMemo(() => {
    const fn = compileMathExpression(calcExpr, useDegrees);
    if (!fn) return null;
    try {
      const val = fn(0);
      return Number.isFinite(val) ? Number(val.toPrecision(12)).toString() : null;
    } catch {
      return null;
    }
  }, [calcExpr, useDegrees]);

  const handleEvaluateCalc = () => {
    if (calcPreview !== null) {
      setCalcHistory((prev) => [{ expr: calcExpr, result: calcPreview }, ...prev.slice(0, 14)]);
      setCalcExpr(calcPreview);
    }
  };

  // 2. Unit Converter State
  const [unitCatId, setUnitCatId] = useState('length');
  const [unitVal, setUnitVal] = useState('100');
  const currentCat = useMemo(
    () => UNIT_CATEGORIES.find((c) => c.id === unitCatId) || UNIT_CATEGORIES[0],
    [unitCatId]
  );
  const [fromUnitId, setFromUnitId] = useState(currentCat.units[0].id);

  useEffect(() => {
    setFromUnitId(currentCat.units[0].id);
  }, [currentCat]);

  const fromUnit = currentCat.units.find((u) => u.id === fromUnitId) || currentCat.units[0];
  const baseValue = fromUnit.toBase(Number(unitVal) || 0);

  // 3. Health & Finance State
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [age, setAge] = useState(28);
  const [sex, setSex] = useState<'m' | 'f'>('m');
  const [activity, setActivity] = useState(1.55);

  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'm' ? 5 : -161);
  const tdee = bmr * activity;
  const hydrationLiters = weightKg * 0.033;

  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);

  const compoundFinal = principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years);

  // 4. Hijri Calendar & World Clock State
  const [gregDate, setGregDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [nowClock, setNowClock] = useState(() => new Date());

  useEffect(() => {
    if (tab !== 'calendarClock') return;
    const id = setInterval(() => setNowClock(new Date()), 1000);
    return () => clearInterval(id);
  }, [tab]);

  const hijriFormatted = useMemo(() => {
    try {
      const d = new Date(gregDate + 'T12:00:00Z');
      return new Intl.DateTimeFormat(isAr ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return '—';
    }
  }, [gregDate, isAr]);

  const worldCities = [
    { ar: 'مكة المكرمة', en: 'Makkah', tz: 'Asia/Riyadh' },
    { ar: 'القاهرة', en: 'Cairo', tz: 'Africa/Cairo' },
    { ar: 'الرباط', en: 'Rabat', tz: 'Africa/Casablanca' },
    { ar: 'دبي', en: 'Dubai', tz: 'Asia/Dubai' },
    { ar: 'لندن', en: 'London', tz: 'Europe/London' },
    { ar: 'باريس', en: 'Paris', tz: 'Europe/Paris' },
    { ar: 'نيويورك', en: 'New York', tz: 'America/New_York' },
    { ar: 'طوكيو', en: 'Tokyo', tz: 'Asia/Tokyo' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'scientific', label: copy.calcTabs.scientific, icon: <Calculator className="w-4 h-4" /> },
            { id: 'units', label: copy.calcTabs.units, icon: <Scale className="w-4 h-4" /> },
            { id: 'healthFinance', label: copy.calcTabs.healthFinance, icon: <HeartPulse className="w-4 h-4" /> },
            { id: 'calendarClock', label: copy.calcTabs.calendarClock, icon: <Calendar className="w-4 h-4" /> },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`min-h-[40px] px-4 py-2 flex items-center gap-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              tab === item.id
                ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SCIENTIFIC CALCULATOR */}
      {tab === 'scientific' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {copy.calcTabs.scientific}
              </h3>
              <button
                type="button"
                onClick={() => setUseDegrees((d) => !d)}
                className="min-h-[34px] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-sky-600 dark:text-cyan-400 cursor-pointer"
              >
                {useDegrees ? 'DEG' : 'RAD'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2" dir="ltr">
              <input
                type="text"
                value={calcExpr}
                onChange={(e) => setCalcExpr(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEvaluateCalc()}
                className="w-full bg-transparent font-mono text-lg sm:text-xl text-slate-900 dark:text-white focus:outline-none"
                placeholder="0"
              />
              <div className="text-right font-mono text-2xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums min-h-[32px]">
                {calcPreview !== null ? `= ${calcPreview}` : '—'}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2" dir="ltr">
              {[
                'sin(', 'cos(', 'tan(', 'sqrt(', '(',
                'ln(', 'log(', 'abs(', 'pi', ')',
                '7', '8', '9', '/', '^',
                '4', '5', '6', '*', 'e',
                '1', '2', '3', '-', 'n!',
                '0', '.', 'C', '+', '=',
              ].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === '=') handleEvaluateCalc();
                    else if (btn === 'C') setCalcExpr('');
                    else if (btn === 'n!') {
                      const n = Number(calcPreview);
                      if (Number.isInteger(n)) setCalcExpr(String(factorial(n)));
                    } else setCalcExpr((prev) => prev + btn);
                  }}
                  className={`min-h-[44px] rounded-lg font-mono text-sm font-semibold border transition-colors cursor-pointer ${
                    btn === '='
                      ? 'bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-transparent'
                      : btn === 'C'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-500'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'سجل العمليات' : 'Calculation History'}
              </h4>
              {calcHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCalcHistory([])}
                  className="text-xs text-slate-500 hover:text-rose-500 cursor-pointer"
                >
                  {isAr ? 'مسح السجل' : 'Clear'}
                </button>
              )}
            </div>
            {calcHistory.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'اضغط = أو Enter لحفظ النتائج في السجل.' : 'Press = or Enter to record calculations.'}
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto" dir="ltr">
                {calcHistory.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCalcExpr(item.expr)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-500 cursor-pointer"
                  >
                    <div className="font-mono text-xs text-slate-500 truncate">{item.expr}</div>
                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      = {item.result}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 14-CATEGORY UNIVERSAL UNIT CONVERTER */}
      {tab === 'units' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-1.5">
            {UNIT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setUnitCatId(cat.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  unitCatId === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-500'
                    : 'bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isAr ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  {isAr ? 'القيمة المدخلة' : 'Input Value'}
                </label>
                <input
                  type="number"
                  value={unitVal}
                  onChange={(e) => setUnitVal(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-lg font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  {isAr ? 'الوحدة الأصلية' : 'Source Unit'}
                </label>
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium"
                >
                  {currentCat.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {isAr ? u.ar : u.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentCat.units.map((u) => {
                const converted = u.fromBase(baseValue);
                return (
                  <div
                    key={u.id}
                    className={`p-4 rounded-xl border ${
                      u.id === fromUnitId
                        ? 'border-sky-500 dark:border-cyan-400 bg-sky-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? u.ar : u.en}
                    </div>
                    <div dir="ltr" className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                      {Number.isFinite(converted) ? Number(converted.toPrecision(8)).toString() : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEALTH & FINANCE */}
      {tab === 'healthFinance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Calculator */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'حاسبة الصحة (BMI / السعرات / الترطيب)' : 'Health, BMI & Caloric Needs Calculator'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'الطول (سم)' : 'Height (cm)'}</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                <input type="number" value={weightKg} onChange={(e) => setWeightKg(Math.max(20, Number(e.target.value)))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'العمر' : 'Age'}</label>
                <input type="number" value={age} onChange={(e) => setAge(Math.max(5, Number(e.target.value)))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'النشاط' : 'Activity'}</label>
                <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full min-h-[40px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                  <option value={1.2}>{isAr ? 'خامل (1.2)' : 'Sedentary (1.2)'}</option>
                  <option value={1.375}>{isAr ? 'خفيف (1.375)' : 'Light (1.375)'}</option>
                  <option value={1.55}>{isAr ? 'متوسط (1.55)' : 'Moderate (1.55)'}</option>
                  <option value={1.725}>{isAr ? 'نشط جداً (1.725)' : 'Active (1.725)'}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setSex('m')} className={`flex-1 min-h-[38px] rounded-lg border text-xs font-semibold cursor-pointer ${sex === 'm' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border-slate-200 dark:border-slate-700'}`}>
                {isAr ? 'ذكر' : 'Male'}
              </button>
              <button type="button" onClick={() => setSex('f')} className={`flex-1 min-h-[38px] rounded-lg border text-xs font-semibold cursor-pointer ${sex === 'f' ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950' : 'border-slate-200 dark:border-slate-700'}`}>
                {isAr ? 'أنثى' : 'Female'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">BMI</div>
                <div className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">{bmi.toFixed(1)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'السعرات اليومية' : 'Daily TDEE'}</div>
                <div className="mt-1 font-mono text-lg font-bold text-sky-600 dark:text-cyan-400 tabular-nums">{Math.round(tdee)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'الماء (لتر/يوم)' : 'Water (L/day)'}</div>
                <div className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{hydrationLiters.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Finance Compound Calculator */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'حاسبة العائد المركب والنمو المالي' : 'Compound Growth & Investment Calculator'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'رأس المال الأساسي' : 'Principal'}</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'العائد السنوي (%)' : 'Annual Rate (%)'}</label>
                <input type="number" step="0.5" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'المدة (سنوات)' : 'Years'}</label>
                <input type="number" min="1" max="60" value={years} onChange={(e) => setYears(Math.max(1, Number(e.target.value)))} className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono tabular-nums" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">{isAr ? 'التركيب سنوياً' : 'Compounds / Year'}</label>
                <select value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))} className="w-full min-h-[40px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                  <option value={1}>{isAr ? 'سنوي (1)' : 'Annually (1)'}</option>
                  <option value={4}>{isAr ? 'ربع سنوي (4)' : 'Quarterly (4)'}</option>
                  <option value={12}>{isAr ? 'شهري (12)' : 'Monthly (12)'}</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{isAr ? 'إجمالي القيمة المستقبلية' : 'Future Value'}</span>
                <span>{isAr ? 'صافي الربح' : 'Total Growth'}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {compoundFinal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +{(compoundFinal - principal).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HIJRI CALENDAR & WORLD CLOCK */}
      {tab === 'calendarClock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'محول التاريخ الهجري (أم القرى)' : 'Hijri Calendar Converter (Umm al-Qura)'}
            </h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                {isAr ? 'اختر التاريخ الميلادي' : 'Select Gregorian Date'}
              </label>
              <input
                type="date"
                value={gregDate}
                onChange={(e) => setGregDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
              />
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'التاريخ الهجري الموافق' : 'Corresponding Hijri Date'}
              </div>
              <div className="font-display text-xl font-bold text-sky-600 dark:text-cyan-400">
                {hijriFormatted}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'الساعة العالمية الحية' : 'Live World Clock'}
              </h3>
              <Clock className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {worldCities.map((city) => {
                const timeStr = new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-GB', {
                  timeZone: city.tz,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }).format(nowClock);
                const dateStr = new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-GB', {
                  timeZone: city.tz,
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                }).format(nowClock);

                return (
                  <div
                    key={city.tz}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {isAr ? city.ar : city.en}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</div>
                    </div>
                    <div className="font-mono text-lg font-bold text-sky-600 dark:text-cyan-400 tabular-nums">
                      {timeStr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
