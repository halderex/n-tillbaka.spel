import { STIMULUS_SETS } from '../lib/stimulusSets';
import type { StimulusTypeId } from '../lib/types';
import type { Translation } from '../lib/i18n';

interface StimulusTypeSelectProps {
  value: StimulusTypeId;
  onChange: (id: StimulusTypeId) => void;
  t: Translation;
}

export function StimulusTypeSelect({ value, onChange, t }: StimulusTypeSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{t.whatToShowPrompt}</p>
      <div className="flex flex-wrap gap-2">
        {STIMULUS_SETS.map((set) => (
          <button
            key={set.id}
            type="button"
            onClick={() => onChange(set.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition active:scale-95 ${
              value === set.id
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-600 hover:bg-emerald-100'
            }`}
          >
            {t.stimulusLabels[set.id]}
          </button>
        ))}
      </div>
    </div>
  );
}
