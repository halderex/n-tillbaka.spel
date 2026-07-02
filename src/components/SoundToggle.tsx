import type { Translation } from '../lib/i18n';

interface SoundToggleProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
  t: Translation;
}

export function SoundToggle({ value, onChange, t }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="self-start rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-600 transition active:scale-95 hover:bg-slate-100"
    >
      {value ? t.soundOnLabel : t.soundOffLabel}
    </button>
  );
}
