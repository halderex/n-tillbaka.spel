import type { Translation } from '../lib/i18n';

interface StimulusDisplayProps {
  stimulus: string;
  level: number;
  currentTrial: number;
  totalTrials: number;
  t: Translation;
}

export function StimulusDisplay({ stimulus, level, currentTrial, totalTrials, t }: StimulusDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">{t.levelLabel(level)}</p>
      <p className="text-sm font-medium text-slate-400">{t.trialProgress(currentTrial, totalTrials)}</p>
      <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-white shadow-sm">
        <span className="text-7xl">{stimulus}</span>
      </div>
    </div>
  );
}
