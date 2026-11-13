import React from 'react';
import { CheckCircle2, Download, Laptop, Smartphone, X } from 'lucide-react';
import { Language } from '../types/app';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  lang,
  isInstallable,
  isInstalled,
  isIOS,
  onInstall,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? 'تثبيت وتشغيل التطبيق الرسمي' : 'Install & Launch as Official App'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {isAr
                ? 'صُمّم هذا التطبيق كـ Progressive Web App مستقل يعمل مباشرة من سطح المكتب أو شاشة الهاتف دون إنترنت.'
                : 'Built as a standalone Progressive Web App that launches directly from your desktop or home screen offline.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {isInstalled ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-sm font-medium">
                {isAr
                  ? 'التطبيق يعمل الآن في وضع التطبيق الرسمي المستقل (Standalone) مع تخزين كامل للعمل دون إنترنت.'
                  : 'Running in Standalone Official App Mode with full offline caching enabled.'}
              </div>
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={async () => {
                const ok = await onInstall();
                if (ok) onClose();
              }}
              className="w-full min-h-[44px] px-4 py-3 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تثبيت التطبيق الآن بنقرة واحدة' : 'Install Official App Now'}</span>
            </button>
          ) : null}

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Laptop className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>{isAr ? 'على الكمبيوتر (Windows / macOS / Linux)' : 'On Desktop (Chrome / Edge)'}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {isAr
                ? '1. في المتصفح اضغط على أيقونة التثبيت في شريط العنوان، أو القائمة ← تثبيت "موسوعة العلم الشاملة". 2. عند تحميل مجلد الأكواد: نفّذ npm install ثم npm run build ثم npm start لفتحه مباشرة كتطبيق مستقل.'
                : '1. Click the Install App icon in your browser address bar. 2. After downloading source files: run npm install, npm run build, then npm start to serve and install it directly.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Smartphone className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>
                {isIOS
                  ? isAr
                    ? 'على الآيفون والآيباد (Safari iOS)'
                    : 'On iPhone & iPad (Safari)'
                  : isAr
                  ? 'على أندرويد و iOS'
                  : 'On Android & iOS'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {isAr
                ? 'في متصفح Safari اضغط زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen). في أندرويد Chrome اختر "تثبيت التطبيق" ليظهر بأيقونته الرسمية ويعمل دون إنترنت.'
                : 'In iOS Safari tap Share → Add to Home Screen. On Android Chrome tap Install App to add the native standalone icon.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
