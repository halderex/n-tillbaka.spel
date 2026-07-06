import { ROUND_LENGTHS } from '../lib/levels';
import type { RoundLength } from '../lib/levels';
import type { Translation } from '../lib/i18n';

interface RoundLengthSelectProps {
  value: RoundLength;
  onChange: (roundLength: RoundLength) => void;
  t: Translation;
}

export function RoundLengthSelect({ value, onChange, t }: RoundLengthSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{t.roundLengthPrompt}</p>
      <div className="flex flex-wrap gap-2">
        {ROUND_LENGTHS.map((length) => (
          <button
            key={length}
            type="button"
            onClick={() => onChange(length)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition active:scale-95 ${
              value === length
                ? 'bg-sky-500 text-white'
                : 'bg-white text-slate-600 hover:bg-sky-100'
            }`}
          >
            {length}
          </button>
        ))}
      </div>
    </div>
  );
}
