import { LEVELS } from '../lib/levels';
import type { Level } from '../lib/levels';
import type { Translation } from '../lib/i18n';

interface LevelSelectProps {
  value: Level;
  onChange: (level: Level) => void;
  t: Translation;
}

export function LevelSelect({ value, onChange, t }: LevelSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{t.stepsBackPrompt}</p>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              value === level
                ? 'bg-sky-500 text-white'
                : 'bg-white text-slate-600 hover:bg-sky-100'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
