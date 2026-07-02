import { LANGUAGES } from '../lib/i18n';
import type { Language, Translation } from '../lib/i18n';

interface LanguageSelectProps {
  value: Language;
  onChange: (language: Language) => void;
  t: Translation;
}

export function LanguageSelect({ value, onChange, t }: LanguageSelectProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{t.languagePrompt}</p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            type="button"
            onClick={() => onChange(language.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition active:scale-95 ${
              value === language.id
                ? 'bg-slate-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
