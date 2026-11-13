import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Download,
  FileText,
  HelpCircle,
  Pause,
  Play,
  Plus,
  RotateCcw,
  StickyNote,
  Trash2,
  Upload,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/planetsAndConstants';
import { t } from '../i18n/translations';
import { Language, NoteItem, TaskItem } from '../types/app';

interface ToolkitWorkspaceViewProps {
  lang: Language;
  initialSubTab?: string;
  notes: NoteItem[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItem[]>>;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  bookmarks: string[];
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

type ToolkitTab = 'devTools' | 'textStudio' | 'notesTasks' | 'quiz';

export const ToolkitWorkspaceView: React.FC<ToolkitWorkspaceViewProps> = ({
  lang,
  initialSubTab,
  notes,
  setNotes,
  tasks,
  setTasks,
  onExportBackup,
  onImportBackup,
}) => {
  const copy = t(lang);
  const isAr = lang === 'ar';

  const [tab, setTab] = useState<ToolkitTab>((initialSubTab as ToolkitTab) || 'devTools');

  useEffect(() => {
    if (initialSubTab && ['devTools', 'textStudio', 'notesTasks', 'quiz'].includes(initialSubTab)) {
      setTab(initialSubTab as ToolkitTab);
    }
  }, [initialSubTab]);

  // 1. Developer Tools State
  const [jsonInput, setJsonInput] = useState('{\n  "app": "Al-Mawsuah",\n  "offline": true,\n  "elements": 118\n}');
  const [jsonResult, setJsonResult] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [hashInput, setHashInput] = useState('موسوعة العلم الشاملة');
  const [sha256Output, setSha256Output] = useState('');
  const [base64Text, setBase64Text] = useState('Universal Science App');
  const [colorHex, setColorHex] = useState('#0EA5E9');
  const [generatedPass, setGeneratedPass] = useState('');

  useEffect(() => {
    let active = true;
    const computeSha256 = async () => {
      try {
        const data = new TextEncoder().encode(hashInput);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hex = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        if (active) setSha256Output(hex);
      } catch {
        if (active) setSha256Output('');
      }
    };
    computeSha256();
    return () => {
      active = false;
    };
  }, [hashInput]);

  const formatJson = (spaces: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonResult(JSON.stringify(parsed, null, spaces));
      setJsonError('');
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    const arr = new Uint32Array(18);
    crypto.getRandomValues(arr);
    setGeneratedPass(Array.from(arr, (n) => chars[n % chars.length]).join(''));
  };

  const base64Encoded = useMemo(() => {
    try {
      const bytes = new TextEncoder().encode(base64Text);
      let bin = '';
      bytes.forEach((b) => { bin += String.fromCharCode(b); });
      return btoa(bin);
    } catch {
      return '';
    }
  }, [base64Text]);

  const hexToRgb = useMemo(() => {
    const clean = colorHex.replace('#', '');
    if (clean.length !== 6) return null;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }, [colorHex]);

  // 2. Text & Markdown Workbench State
  const [textInput, setTextInput] = useState(
    isAr
      ? '# مُلاحَظاتُ العِلم\nالعِلمُ نُورٌ يُضيءُ طريقَ الإنسانِ لفهمِ الكونِ وقوانينِهِ.'
      : '# Scientific Notes\nScience is the systematic pursuit of verifiable knowledge across the cosmos.'
  );

  const textStats = useMemo(() => {
    const trimmed = textInput.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = textInput.length;
    const charsNoSpaces = textInput.replace(/\s/g, '').length;
    const lines = textInput ? textInput.split('\n').length : 0;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, lines, readMin };
  }, [textInput]);

  const stripArabicDiacritics = () => {
    setTextInput((prev) => prev.replace(/[\u064B-\u065F\u0670]/g, ''));
  };

  const downloadTextMd = () => {
    const blob = new Blob([textInput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'al-mawsuah-note.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 3. Notes, Tasks & Pomodoro State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [pomodoroSec, setPomodoroSec] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pomodoroRunning) return;
    const id = setInterval(() => {
      setPomodoroSec((prev) => {
        if (prev <= 1) {
          setPomodoroRunning(false);
          // Gentle Web Audio chime
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(528, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
          } catch {
            // Audio context unavailable
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [pomodoroRunning]);

  const addNote = () => {
    if (!newNoteTitle.trim() && !newNoteBody.trim()) return;
    const item: NoteItem = {
      id: crypto.randomUUID(),
      title: newNoteTitle.trim() || (isAr ? 'ملاحظة جديدة' : 'Untitled Note'),
      content: newNoteBody.trim(),
      updatedAt: new Date().toISOString(),
      category: 'general',
    };
    setNotes((prev) => [item, ...prev]);
    setNewNoteTitle('');
    setNewNoteBody('');
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const item: TaskItem = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      done: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [item, ...prev]);
    setNewTaskTitle('');
  };

  // 4. Knowledge Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[quizIndex];

  const handleAnswer = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    if (optIdx === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {(
          [
            { id: 'devTools', label: copy.toolkitTabs.devTools, icon: <Code2 className="w-4 h-4" /> },
            { id: 'textStudio', label: copy.toolkitTabs.textStudio, icon: <FileText className="w-4 h-4" /> },
            { id: 'notesTasks', label: copy.toolkitTabs.notesTasks, icon: <StickyNote className="w-4 h-4" /> },
            { id: 'quiz', label: copy.toolkitTabs.quiz, icon: <HelpCircle className="w-4 h-4" /> },
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

      {/* TAB 1: DEVELOPER & DATA STUDIO */}
      {tab === 'devTools' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Formatter */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'منسق وفاحص JSON' : 'JSON Formatter & Validator'}
            </h3>
            <textarea
              dir="ltr"
              rows={5}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs"
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => formatJson(2)} className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer">
                {isAr ? 'تنسيق (2 مسافات)' : 'Format (2 spaces)'}
              </button>
              <button type="button" onClick={() => formatJson(0)} className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                {isAr ? 'ضغط (Minify)' : 'Minify'}
              </button>
            </div>
            {jsonError && <div className="text-xs text-rose-600 dark:text-rose-400 font-mono">{jsonError}</div>}
            {jsonResult && (
              <pre dir="ltr" className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto">
                {jsonResult}
              </pre>
            )}
          </div>

          {/* SHA-256, Base64, Color & Password */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مولد بصمة SHA-256 و Base64' : 'SHA-256 Hash & Base64 Encoder'}
              </h3>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                placeholder={isAr ? 'أدخل نصاً لتوليد بصمة SHA-256...' : 'Input text for SHA-256...'}
              />
              <div dir="ltr" className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-[11px] break-all text-sky-600 dark:text-cyan-400">
                SHA-256: {sha256Output || '—'}
              </div>
              <input
                type="text"
                dir="ltr"
                value={base64Text}
                onChange={(e) => setBase64Text(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs"
              />
              <div dir="ltr" className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-xs break-all text-slate-700 dark:text-slate-300">
                Base64: {base64Encoded}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {isAr ? 'محول الألوان ومولد كلمات المرور المشفرة' : 'Color Inspector & Crypto Password Generator'}
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <div dir="ltr" className="font-mono text-xs space-y-0.5">
                  <div className="font-bold">{colorHex.toUpperCase()}</div>
                  {hexToRgb && (
                    <div className="text-slate-500">
                      rgb({hexToRgb.r}, {hexToRgb.g}, {hexToRgb.b})
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {isAr ? 'توليد كلمة مرور عشوائية' : 'Generate Secure Password'}
                </button>
                <div dir="ltr" className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate">
                  {generatedPass || '••••••••••••••••••'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEXT & MARKDOWN WORKBENCH */}
      {tab === 'textStudio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'محرر ومحلل النصوص العربية والإنجليزية' : 'Bilingual Text & Markdown Workbench'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={stripArabicDiacritics}
                  className="min-h-[36px] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
                >
                  {isAr ? 'إزالة التشكيل' : 'Strip Tashkeel'}
                </button>
                <button
                  type="button"
                  onClick={downloadTextMd}
                  className="min-h-[36px] px-3 py-1 flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.MD</span>
                </button>
              </div>
            </div>
            <textarea
              rows={10}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm leading-relaxed focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'إحصائيات النص الفورية' : 'Live Text Telemetry'}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'الكلمات' : 'Words'}</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums">{textStats.words}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'الأحرف' : 'Characters'}</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums">{textStats.chars}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'دون مسافات' : 'No Spaces'}</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums">{textStats.charsNoSpaces}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500">{isAr ? 'زمن القراءة (دقيقة)' : 'Read Time (min)'}</div>
                <div className="mt-1 font-mono text-2xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums">{textStats.readMin}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTES, TASKS, POMODORO & LOCAL VAULT */}
      {tab === 'notesTasks' && (
        <div className="space-y-6">
          {/* Backup Toolbar */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isAr
                ? 'جميع ملاحظاتك ومهامك محفوظة محلياً داخل التطبيق وتعمل دون إنترنت.'
                : 'All notes and tasks are persisted locally inside your offline app vault.'}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExportBackup}
                className="min-h-[38px] px-3.5 py-1.5 flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{copy.actions.exportJson}</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[38px] px-3.5 py-1.5 flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{copy.actions.importJson}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImportBackup(f);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Notes Vault */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مفكرة المعرفة السريعة' : 'Quick Knowledge Notes'}
              </h3>
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder={isAr ? 'عنوان الملاحظة...' : 'Note title...'}
                className="w-full min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
              <textarea
                rows={3}
                value={newNoteBody}
                onChange={(e) => setNewNoteBody(e.target.value)}
                placeholder={isAr ? 'اكتب ملخصاً أو فكرة أو معادلة...' : 'Write summary or formula...'}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              />
              <button
                type="button"
                onClick={addNote}
                className="w-full min-h-[40px] px-4 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'حفظ الملاحظة' : 'Save Note'}</span>
              </button>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pt-2">
                {notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{n.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{n.content}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotes((prev) => prev.filter((item) => item.id !== n.id))}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      aria-label={copy.actions.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Task List */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مدير المهام والأهداف' : 'Tasks & Goals Tracker'}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder={isAr ? 'مهمة جديدة...' : 'New task...'}
                  className="flex-1 min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
                <button
                  type="button"
                  onClick={addTask}
                  className="min-h-[40px] px-3.5 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.map((tItem) => (tItem.id === task.id ? { ...tItem, done: !tItem.done } : tItem)))}
                      className="flex items-center gap-2.5 text-start flex-1 min-w-0 cursor-pointer"
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                      <span className={`text-sm truncate ${task.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTasks((prev) => prev.filter((tItem) => tItem.id !== task.id))}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pomodoro Focus Timer */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {isAr ? 'مؤقت التركيز (بومودورو)' : 'Focus Pomodoro Timer'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isAr ? 'جلسة دراسة عميقة مع تنبيه صوتي' : 'Deep work session with audio chime'}
                </p>
              </div>

              <div className="py-6 text-center font-mono text-4xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums">
                {String(Math.floor(pomodoroSec / 60)).padStart(2, '0')}:{String(pomodoroSec % 60).padStart(2, '0')}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPomodoroRunning((r) => !r)}
                    className="flex-1 min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    {pomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{pomodoroRunning ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'ابدأ' : 'Start')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPomodoroRunning(false);
                      setPomodoroSec(25 * 60);
                    }}
                    className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setPomodoroRunning(false); setPomodoroSec(25 * 60); }} className="py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer">
                    25 {isAr ? 'دقيقة' : 'min'}
                  </button>
                  <button type="button" onClick={() => { setPomodoroRunning(false); setPomodoroSec(5 * 60); }} className="py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer">
                    5 {isAr ? 'استراحة' : 'break'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-DOMAIN KNOWLEDGE QUIZ */}
      {tab === 'quiz' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-6">
          {quizFinished ? (
            <div className="text-center space-y-4 py-6">
              <div className="text-xs font-semibold text-slate-500">
                {isAr ? 'اكتمل التحدي المعرفي' : 'Knowledge Challenge Complete'}
              </div>
              <div className="font-mono text-4xl font-bold text-sky-600 dark:text-cyan-400 tabular-nums">
                {score} / {QUIZ_QUESTIONS.length}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isAr
                  ? 'أحسنت! يمكنك إعادة الاختبار أو مراجعة المقالات العلمية في الموسوعة.'
                  : 'Well done! Restart the quiz anytime or review topics in the Encyclopedia.'}
              </p>
              <button
                type="button"
                onClick={resetQuiz}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-semibold text-sm cursor-pointer"
              >
                {isAr ? 'إعادة الاختبار' : 'Restart Quiz'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {copy.disciplines[currentQuestion.discipline]} · {isAr ? 'السؤال' : 'Question'} {quizIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-mono font-bold tabular-nums">
                  {isAr ? 'النتيجة:' : 'Score:'} {score}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {isAr ? currentQuestion.questionAr : currentQuestion.questionEn}
              </h3>

              <div className="space-y-2.5">
                {(isAr ? currentQuestion.optionsAr : currentQuestion.optionsEn).map((opt, idx) => {
                  const isCorrect = idx === currentQuestion.correctIndex;
                  const isPicked = idx === selectedOption;
                  let style = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-sky-500';
                  if (selectedOption !== null) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200';
                    else if (isPicked) style = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswer(idx)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-start text-sm font-medium transition-colors cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isAr ? currentQuestion.explanationAr : currentQuestion.explanationEn}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="min-h-[40px] px-5 py-2 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    {quizIndex + 1 < QUIZ_QUESTIONS.length
                      ? isAr
                        ? 'السؤال التالي'
                        : 'Next Question'
                      : isAr
                      ? 'عرض النتيجة النهائية'
                      : 'View Final Score'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
