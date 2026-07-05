import type { Translation } from '../lib/i18n';

interface ResponseControlsProps {
  canMatch: boolean;
  onRespond: (isMatch: boolean) => void;
  t: Translation;
}

export function ResponseControls({ canMatch, onRespond, t }: ResponseControlsProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onRespond(true)}
        disabled={!canMatch}
        className="rounded-full bg-white px-6 py-3 text-base font-medium text-slate-600 transition active:scale-95 active:bg-emerald-100 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
      >
        {t.matchButton}
      </button>
      <button
        type="button"
        onClick={() => onRespond(false)}
        className="rounded-full bg-white px-6 py-3 text-base font-medium text-slate-600 transition active:scale-95 active:bg-red-100 hover:bg-red-100"
      >
        {t.noMatchButton}
      </button>
    </div>
  );
}
