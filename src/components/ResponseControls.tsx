import type { Translation } from '../lib/i18n';

interface ResponseControlsProps {
  canMatch: boolean;
  hasMarkedMatch: boolean;
  isLastTrial: boolean;
  onMatch: () => void;
  onAdvance: () => void;
  t: Translation;
}

export function ResponseControls({
  canMatch,
  hasMarkedMatch,
  isLastTrial,
  onMatch,
  onAdvance,
  t,
}: ResponseControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onMatch}
        disabled={!canMatch}
        className={`rounded-full px-6 py-3 text-base font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
          hasMarkedMatch
            ? 'bg-emerald-500 text-white'
            : 'bg-white text-slate-600 hover:bg-emerald-100'
        }`}
      >
        {hasMarkedMatch ? t.matchNotedButton : t.matchButton}
      </button>
      <button
        type="button"
        onClick={onAdvance}
        className="rounded-full bg-sky-500 px-8 py-3 text-base font-medium text-white transition active:scale-95 hover:bg-sky-600"
      >
        {isLastTrial ? t.finishButton : t.nextButton}
      </button>
    </div>
  );
}
