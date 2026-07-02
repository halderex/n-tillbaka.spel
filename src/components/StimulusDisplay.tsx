import { useEffect, useRef, useState } from 'react';
import type { Translation } from '../lib/i18n';

const BLANK_DURATION_MS = 300;

interface StimulusDisplayProps {
  stimulus: string;
  level: number;
  currentTrial: number;
  totalTrials: number;
  t: Translation;
}

export function StimulusDisplay({ stimulus, level, currentTrial, totalTrials, t }: StimulusDisplayProps) {
  const [displayStimulus, setDisplayStimulus] = useState<string | null>(stimulus);
  const lastHandledTrial = useRef(currentTrial);

  useEffect(() => {
    if (lastHandledTrial.current === currentTrial) return;
    lastHandledTrial.current = currentTrial;

    setDisplayStimulus(null);
    const timeout = setTimeout(() => setDisplayStimulus(stimulus), BLANK_DURATION_MS);
    return () => clearTimeout(timeout);
    // stimulus intentionally omitted — only the trial changing should trigger a re-reveal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrial]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">{t.levelLabel(level)}</p>
      <p className="text-sm font-medium text-slate-400">{t.trialProgress(currentTrial, totalTrials)}</p>
      <div
        key={displayStimulus === null ? 'blank' : currentTrial}
        className={`flex h-48 w-48 items-center justify-center rounded-3xl bg-white shadow-sm ${
          displayStimulus !== null ? 'animate-stimulus-in' : ''
        }`}
      >
        <span className="text-7xl">{displayStimulus ?? ''}</span>
      </div>
    </div>
  );
}
