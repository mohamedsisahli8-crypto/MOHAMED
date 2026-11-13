import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Cpu, FlaskConical, LineChart, Pause, Play, RotateCcw } from 'lucide-react';
import { t } from '../i18n/translations';
import { Language } from '../types/app';
import { compileMathExpression } from '../utils/mathParser';

interface ScienceLabsViewProps {
  lang: Language;
  initialSubTab?: string;
}

type LabTab = 'grapher' | 'pendulum' | 'chemistry' | 'logic';
type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

export const ScienceLabsView: React.FC<ScienceLabsViewProps> = ({ lang, initialSubTab }) => {
  const copy = t(lang);
  const isAr = lang === 'ar';

  const [labTab, setLabTab] = useState<LabTab>(
    (initialSubTab as LabTab) || 'grapher'
  );

  useEffect(() => {
    if (initialSubTab && ['grapher', 'pendulum', 'chemistry', 'logic'].includes(initialSubTab)) {
      setLabTab(initialSubTab as LabTab);
    }
  }, [initialSubTab]);

  // 1. Function Grapher State
  const [expr, setExpr] = useState('sin(x) * cos(0.5*x) + 0.15*x');
  const [xRange, setXRange] = useState(8);
  const [probeX, setProbeX] = useState(1.5);
  const [integralA, setIntegralA] = useState(0);
  const [integralB, setIntegralB] = useState(3.14);

  const compiledFn = useMemo(() => compileMathExpression(expr, false), [expr]);

  const graphStats = useMemo(() => {
    if (!compiledFn) return null;
    try {
      const fx = compiledFn(probeX);
      const h = 0.0001;
      const deriv = (compiledFn(probeX + h) - compiledFn(probeX - h)) / (2 * h);

      // Simpson's rule integration
      const n = 200;
      const step = (integralB - integralA) / n;
      let sum = compiledFn(integralA) + compiledFn(integralB);
      for (let i = 1; i < n; i++) {
        const val = compiledFn(integralA + i * step);
        if (Number.isFinite(val)) {
          sum += (i % 2 === 0 ? 2 : 4) * val;
        }
      }
      const integral = (step / 3) * sum;
      return { fx, deriv, integral };
    } catch {
      return null;
    }
  }, [compiledFn, probeX, integralA, integralB]);

  const graphPoints = useMemo(() => {
    if (!compiledFn) return '';
    const w = 600;
    const h = 320;
    const yRange = xRange * (h / w);
    const pts: string[] = [];
    const samples = 240;

    for (let i = 0; i <= samples; i++) {
      const x = -xRange + (i / samples) * (2 * xRange);
      const y = compiledFn(x);
      if (Number.isFinite(y) && Math.abs(y) <= yRange * 2.5) {
        const sx = (i / samples) * w;
        const sy = h / 2 - (y / yRange) * (h / 2);
        pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [compiledFn, xRange]);

  // 2. Pendulum Simulator State
  const [pendLength, setPendLength] = useState(1.5);
  const [pendGravity, setPendGravity] = useState(9.81);
  const [pendAngleDeg, setPendAngleDeg] = useState(35);
  const [pendDamping, setPendDamping] = useState(0.02);
  const [pendRunning, setPendRunning] = useState(true);
  const [pendState, setPendState] = useState({ theta: (35 * Math.PI) / 180, omega: 0, t: 0 });

  useEffect(() => {
    if (labTab !== 'pendulum' || !pendRunning) return;
    let frameId: number;
    let last = performance.now();
    const stepPhysics = (now: number) => {
      const dt = Math.min(0.03, (now - last) / 1000);
      last = now;
      setPendState((prev) => {
        const alpha = -(pendGravity / pendLength) * Math.sin(prev.theta) - pendDamping * prev.omega;
        const nextOmega = prev.omega + alpha * dt;
        const nextTheta = prev.theta + nextOmega * dt;
        return { theta: nextTheta, omega: nextOmega, t: prev.t + dt };
      });
      frameId = requestAnimationFrame(stepPhysics);
    };
    frameId = requestAnimationFrame(stepPhysics);
    return () => cancelAnimationFrame(frameId);
  }, [labTab, pendRunning, pendLength, pendGravity, pendDamping]);

  const resetPendulum = () => {
    setPendState({ theta: (pendAngleDeg * Math.PI) / 180, omega: 0, t: 0 });
  };

  // 3. Chemistry Gas & pH Lab State
  const [phVal, setPhVal] = useState(7.0);
  const [moles, setMoles] = useState(1.0);
  const [tempK, setTempK] = useState(298);
  const [volL, setVolL] = useState(22.4);

  const pressureAtm = useMemo(() => {
    return (moles * 0.082057 * tempK) / Math.max(0.5, volL);
  }, [moles, tempK, volL]);

  const phClassification = useMemo(() => {
    if (phVal < 6.5) return { ar: 'حمضي (Acidic)', en: 'Acidic', color: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' };
    if (phVal > 7.5) return { ar: 'قاعدي / قلوي (Basic)', en: 'Alkaline / Basic', color: 'text-sky-600 dark:text-cyan-400', bar: 'bg-sky-500' };
    return { ar: 'متعادل (Neutral)', en: 'Neutral', color: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' };
  }, [phVal]);

  // 4. Logic Gates & Radix State
  const [inputA, setInputA] = useState(true);
  const [inputB, setInputB] = useState(false);
  const [gateType, setGateType] = useState<GateType>('XOR');
  const [decimalInput, setDecimalInput] = useState(42);

  const evaluateGate = (g: GateType, a: boolean, b: boolean) => {
    switch (g) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'XOR': return a !== b;
      case 'NAND': return !(a && b);
      case 'NOR': return !(a || b);
      case 'XNOR': return a === b;
    }
  };

  const gateOutput = evaluateGate(gateType, inputA, inputB);

  return (
    <div className="space-y-6">
      {/* Lab Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'grapher', label: copy.labsTabs.grapher, icon: <LineChart className="w-4 h-4" /> },
            { id: 'pendulum', label: copy.labsTabs.pendulum, icon: <Activity className="w-4 h-4" /> },
            { id: 'chemistry', label: copy.labsTabs.chemistry, icon: <FlaskConical className="w-4 h-4" /> },
            { id: 'logic', label: copy.labsTabs.logic, icon: <Cpu className="w-4 h-4" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setLabTab(tab.id)}
            className={`min-h-[40px] px-4 py-2 flex items-center gap-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              labTab === tab.id
                ? 'bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* LAB 1: LIVE FUNCTION GRAPHER & CALCULUS */}
      {labTab === 'grapher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مختبر الدوال والتفاضل والتكامل' : 'Function & Calculus Lab'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? 'أدخل أي دالة بدلالة x مثل sin(x) أو x^2 - 4' : 'Enter any expression in x (sin, cos, exp, sqrt, ^)'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                f(x) =
              </label>
              <input
                type="text"
                dir="ltr"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
              {!compiledFn && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {isAr ? 'صيغة رياضية غير صالحة' : 'Invalid mathematical expression'}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['sin(x)', 'x^2 - 3', 'exp(-x^2/4)*cos(3*x)', 'sqrt(abs(x))'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    dir="ltr"
                    onClick={() => setExpr(preset)}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 hover:border-sky-500 cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs text-slate-600 dark:text-slate-300">
                <span className="flex justify-between mb-1">
                  <span>{isAr ? 'نطاق المحور X' : 'Axis Span (±X)'}</span>
                  <span className="font-mono tabular-nums">±{xRange}</span>
                </span>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={xRange}
                  onChange={(e) => setXRange(Number(e.target.value))}
                  className="w-full accent-sky-600 dark:accent-cyan-400"
                />
              </label>

              <label className="block text-xs text-slate-600 dark:text-slate-300">
                <span className="flex justify-between mb-1">
                  <span>{isAr ? 'نقطة الفحص والمشتقة (x₀)' : 'Probe Point (x₀)'}</span>
                  <span className="font-mono tabular-nums">{probeX.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={-xRange}
                  max={xRange}
                  step="0.1"
                  value={probeX}
                  onChange={(e) => setProbeX(Number(e.target.value))}
                  className="w-full accent-sky-600 dark:accent-cyan-400"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isAr ? 'حد التكامل a' : 'Integral a'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={integralA}
                    onChange={(e) => setIntegralA(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{isAr ? 'حد التكامل b' : 'Integral b'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={integralB}
                    onChange={(e) => setIntegralB(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs tabular-nums"
                  />
                </div>
              </div>
            </div>

            {graphStats && (
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500">f({probeX.toFixed(2)})</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {Number.isFinite(graphStats.fx) ? graphStats.fx.toFixed(4) : 'NaN'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500">{isAr ? 'المشتقة f′(x₀)' : 'Derivative f′(x₀)'}</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {Number.isFinite(graphStats.deriv) ? graphStats.deriv.toFixed(4) : 'NaN'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <span className="text-slate-500">{isAr ? `التكامل [${integralA}, ${integralB}]` : `Integral [${integralA}, ${integralB}]`}</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-cyan-400 tabular-nums">
                    {Number.isFinite(graphStats.integral) ? graphStats.integral.toFixed(4) : 'NaN'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#07090E] border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono" dir="ltr">
              <span>y = {expr}</span>
              <span>Range: [-{xRange}, +{xRange}]</span>
            </div>
            <svg viewBox="0 0 600 320" className="w-full h-auto bg-[#0B1120] rounded-xl border border-slate-800">
              {/* Coordinate Grid */}
              {Array.from({ length: 11 }).map((_, idx) => {
                const gx = (idx / 10) * 600;
                const gy = (idx / 10) * 320;
                return (
                  <g key={idx}>
                    <line x1={gx} y1="0" x2={gx} y2="320" stroke="#1E293B" strokeWidth="1" />
                    <line x1="0" y1={gy} x2="600" y2={gy} stroke="#1E293B" strokeWidth="1" />
                  </g>
                );
              })}
              {/* Axes */}
              <line x1="0" y1="160" x2="600" y2="160" stroke="#475569" strokeWidth="1.5" />
              <line x1="300" y1="0" x2="300" y2="320" stroke="#475569" strokeWidth="1.5" />
              {/* Function Curve */}
              {graphPoints && (
                <polyline
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  points={graphPoints}
                />
              )}
              {/* Probe Point */}
              {graphStats && Number.isFinite(graphStats.fx) && (
                <g>
                  {(() => {
                    const yRange = xRange * (320 / 600);
                    const px = ((probeX + xRange) / (2 * xRange)) * 600;
                    const py = 160 - (graphStats.fx / yRange) * 160;
                    if (py < -20 || py > 340) return null;
                    return (
                      <>
                        <line x1={px} y1="0" x2={px} y2="320" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth="1" />
                        <circle cx={px} cy={py} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* LAB 2: PENDULUM MECHANICS SIMULATOR */}
      {labTab === 'pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'مختبر البندول البسيط والحركة التوافقية' : 'Simple Pendulum Mechanics Lab'}
            </h3>

            <label className="block text-xs text-slate-600 dark:text-slate-300">
              <span className="flex justify-between mb-1">
                <span>{isAr ? 'طول الخيط (L)' : 'Pendulum Length (L)'}</span>
                <span className="font-mono tabular-nums">{pendLength.toFixed(2)} m</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={pendLength}
                onChange={(e) => setPendLength(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </label>

            <label className="block text-xs text-slate-600 dark:text-slate-300">
              <span className="flex justify-between mb-1">
                <span>{isAr ? 'الجاذبية (g)' : 'Gravity (g)'}</span>
                <span className="font-mono tabular-nums">{pendGravity.toFixed(2)} m/s²</span>
              </span>
              <input
                type="range"
                min="1.6"
                max="24.8"
                step="0.1"
                value={pendGravity}
                onChange={(e) => setPendGravity(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </label>

            <label className="block text-xs text-slate-600 dark:text-slate-300">
              <span className="flex justify-between mb-1">
                <span>{isAr ? 'التخميد الاحتكاكي' : 'Air Damping'}</span>
                <span className="font-mono tabular-nums">{pendDamping.toFixed(3)}</span>
              </span>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.005"
                value={pendDamping}
                onChange={(e) => setPendDamping(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </label>

            <label className="block text-xs text-slate-600 dark:text-slate-300">
              <span className="flex justify-between mb-1">
                <span>{isAr ? 'الزاوية الابتدائية' : 'Release Angle'}</span>
                <span className="font-mono tabular-nums">{pendAngleDeg}°</span>
              </span>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={pendAngleDeg}
                onChange={(e) => setPendAngleDeg(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendRunning((r) => !r)}
                className="flex-1 min-h-[40px] px-4 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-semibold text-xs cursor-pointer"
              >
                {pendRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{pendRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Resume')}</span>
              </button>
              <button
                type="button"
                onClick={resetPendulum}
                className="min-h-[40px] px-4 py-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{copy.actions.reset}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="text-slate-500">{isAr ? 'الزمن الدوري T' : 'Period (T)'}</div>
                <div className="mt-1 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                  {(2 * Math.PI * Math.sqrt(pendLength / pendGravity)).toFixed(3)} s
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div className="text-slate-500">{isAr ? 'الزاوية الآنية θ' : 'Angle θ'}</div>
                <div className="mt-1 font-mono text-sm font-bold tabular-nums text-sky-600 dark:text-cyan-400">
                  {((pendState.theta * 180) / Math.PI).toFixed(1)}°
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#07090E] border border-slate-800 text-white">
            <svg viewBox="0 0 520 320" className="w-full h-auto bg-[#0B1120] rounded-xl border border-slate-800">
              <line x1="60" y1="36" x2="460" y2="36" stroke="#334155" strokeWidth="3" />
              {(() => {
                const pivotX = 260;
                const pivotY = 36;
                const pxLen = pendLength * 80;
                const bx = pivotX + pxLen * Math.sin(pendState.theta);
                const by = pivotY + pxLen * Math.cos(pendState.theta);
                return (
                  <g>
                    <line
                      x1={pivotX}
                      y1={pivotY}
                      x2={pivotX}
                      y2={pivotY + pxLen + 20}
                      stroke="#1E293B"
                      strokeDasharray="4 4"
                    />
                    <line x1={pivotX} y1={pivotY} x2={bx} y2={by} stroke="#94A3B8" strokeWidth="2.5" />
                    <circle cx={pivotX} cy={pivotY} r="5" fill="#F8FAFC" />
                    <circle cx={bx} cy={by} r="16" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* LAB 3: CHEMISTRY pH & IDEAL GAS LAW LAB */}
      {labTab === 'chemistry' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* pH Scale Lab */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مقياس الرقم الهيدروجيني pH وتركيز الهيدرونيوم' : 'Acids, Bases & pH Equilibrium Lab'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                pH = −log₁₀[H⁺] · pH + pOH = 14
              </p>
            </div>

            <label className="block text-xs text-slate-600 dark:text-slate-300">
              <span className="flex justify-between mb-2">
                <span>{isAr ? 'ضبط قيمة pH' : 'Adjust pH Level'}</span>
                <span className="font-mono text-base font-bold tabular-nums">{phVal.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={phVal}
                onChange={(e) => setPhVal(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </label>

            <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-rose-500 via-emerald-500 to-sky-600 relative">
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white border border-slate-900"
                style={{ left: `${(phVal / 14) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'التصنيف' : 'Classification'}</div>
                <div className={`mt-1 font-bold ${phClassification.color}`}>
                  {isAr ? phClassification.ar : phClassification.en}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">[H⁺] (mol/L)</div>
                <div dir="ltr" className="mt-1 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {Math.pow(10, -phVal).toExponential(2)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">pOH</div>
                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {(14 - phVal).toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Gas Law Lab */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مختبر قانون الغاز المثالي (PV = nRT)' : 'Ideal Gas Law Simulator (PV = nRT)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                R = 0.082057 L·atm / (mol·K)
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-slate-600 dark:text-slate-300">
                <span className="flex justify-between mb-1">
                  <span>{isAr ? 'عدد المولات (n)' : 'Moles (n)'}</span>
                  <span className="font-mono tabular-nums">{moles.toFixed(1)} mol</span>
                </span>
                <input type="range" min="0.5" max="5" step="0.1" value={moles} onChange={(e) => setMoles(Number(e.target.value))} className="w-full accent-sky-600" />
              </label>

              <label className="block text-xs text-slate-600 dark:text-slate-300">
                <span className="flex justify-between mb-1">
                  <span>{isAr ? 'درجة الحرارة (T)' : 'Temperature (T)'}</span>
                  <span className="font-mono tabular-nums">{tempK} K ({(tempK - 273.15).toFixed(0)} °C)</span>
                </span>
                <input type="range" min="150" max="600" step="5" value={tempK} onChange={(e) => setTempK(Number(e.target.value))} className="w-full accent-sky-600" />
              </label>

              <label className="block text-xs text-slate-600 dark:text-slate-300">
                <span className="flex justify-between mb-1">
                  <span>{isAr ? 'الحجم (V)' : 'Volume (V)'}</span>
                  <span className="font-mono tabular-nums">{volL.toFixed(1)} L</span>
                </span>
                <input type="range" min="5" max="50" step="0.5" value={volL} onChange={(e) => setVolL(Number(e.target.value))} className="w-full accent-sky-600" />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">{isAr ? 'الضغط الناتج (P)' : 'Resulting Pressure (P)'}</div>
                <div className="font-mono text-2xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums mt-0.5">
                  {pressureAtm.toFixed(3)} atm
                </div>
              </div>
              <div className="text-end font-mono text-xs text-slate-500 tabular-nums">
                {(pressureAtm * 101.325).toFixed(1)} kPa
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB 4: LOGIC GATES & NUMBER RADIX LAB */}
      {labTab === 'logic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'محاكي البوابات المنطقية وجدول الحقيقة' : 'Digital Logic Gate & Truth Table Lab'}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'] as GateType[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGateType(g)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold border cursor-pointer ${
                    gateType === g
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setInputA((v) => !v)}
                  className={`w-full min-h-[44px] rounded-lg font-mono text-sm font-bold border cursor-pointer ${
                    inputA
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-[#0B1120] border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  A = {inputA ? '1' : '0'}
                </button>
                <button
                  type="button"
                  onClick={() => setInputB((v) => !v)}
                  className={`w-full min-h-[44px] rounded-lg font-mono text-sm font-bold border cursor-pointer ${
                    inputB
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-[#0B1120] border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  B = {inputB ? '1' : '0'}
                </button>
              </div>

              <div className="text-center font-mono text-base font-bold text-sky-600 dark:text-cyan-400">
                [ {gateType} ] →
              </div>

              <div
                className={`min-h-[64px] rounded-xl border flex flex-col items-center justify-center font-mono ${
                  gateOutput
                    ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-cyan-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span className="text-xs">OUT</span>
                <span className="text-2xl font-bold">{gateOutput ? '1' : '0'}</span>
              </div>
            </div>

            <table className="w-full text-xs font-mono text-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500">
                <tr>
                  <th className="py-2">A</th>
                  <th className="py-2">B</th>
                  <th className="py-2">{gateType}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[[false, false], [false, true], [true, false], [true, true]].map(([a, b], i) => {
                  const res = evaluateGate(gateType, a, b);
                  const current = a === inputA && b === inputB;
                  return (
                    <tr key={i} className={current ? 'bg-sky-500/10 font-bold' : ''}>
                      <td className="py-2">{a ? '1' : '0'}</td>
                      <td className="py-2">{b ? '1' : '0'}</td>
                      <td className="py-2 text-sky-600 dark:text-cyan-400">{res ? '1' : '0'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'محول أنظمة العد الرقمية (Binary / Oct / Dec / Hex)' : 'Number Base & Radix Converter'}
            </h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5">
                {isAr ? 'أدخل عدداً صحيحاً عشرياً (Decimal)' : 'Enter Decimal Integer'}
              </label>
              <input
                type="number"
                min="0"
                max="1000000000"
                value={decimalInput}
                onChange={(e) => setDecimalInput(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-base font-bold tabular-nums"
              />
            </div>

            <div className="space-y-3" dir="ltr">
              {[
                { label: 'Binary (Base 2)', val: decimalInput.toString(2).padStart(8, '0') },
                { label: 'Octal (Base 8)', val: decimalInput.toString(8) },
                { label: 'Decimal (Base 10)', val: decimalInput.toString(10) },
                { label: 'Hexadecimal (Base 16)', val: '0x' + decimalInput.toString(16).toUpperCase() },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white break-all tabular-nums">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
