import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNBackGame } from './hooks/useNBackGame';
import { useClickSound } from './hooks/useClickSound';
import { useTadaSound } from './hooks/useTadaSound';
import { LEVELS, DEFAULT_ROUND_LENGTH } from './lib/levels';
import type { Level, RoundLength } from './lib/levels';
import { STIMULUS_SETS } from './lib/stimulusSets';
import type { RoundResult, StimulusTypeId } from './lib/types';
import { TRANSLATIONS } from './lib/i18n';
import type { Language } from './lib/i18n';
import { LevelSelect } from './components/LevelSelect';
import { StimulusTypeSelect } from './components/StimulusTypeSelect';
import { RoundLengthSelect } from './components/RoundLengthSelect';
import { LanguageSelect } from './components/LanguageSelect';
import { SoundToggle } from './components/SoundToggle';
import { StimulusDisplay } from './components/StimulusDisplay';
import { ResponseControls } from './components/ResponseControls';
import { RoundSummary } from './components/RoundSummary';

const HISTORY_LIMIT = 50;
const DEFAULT_LANGUAGE: Language = navigator.language.toLowerCase().startsWith('sv') ? 'sv' : 'en';

// Language selection is currently hidden and the app is forced to Swedish.
// Flip this to true to restore the in-app language picker; all the i18n
// plumbing (LanguageSelect, English strings, persisted preference) is kept intact.
const LANGUAGE_SELECT_ENABLED = false;

function App() {
  const [lastLevel, setLastLevel] = useLocalStorage<Level>('nback:lastLevel', LEVELS[0]);
  const [lastStimulusType, setLastStimulusType] = useLocalStorage<StimulusTypeId>(
    'nback:lastStimulusType',
    STIMULUS_SETS[0].id
  );
  const [roundLength, setRoundLength] = useLocalStorage<RoundLength>(
    'nback:roundLength',
    DEFAULT_ROUND_LENGTH
  );
  const [storedLanguage, setLanguage] = useLocalStorage<Language>('nback:language', DEFAULT_LANGUAGE);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('nback:soundEnabled', true);
  const [history, setHistory] = useLocalStorage<RoundResult[]>('nback:history', []);

  // While the picker is hidden, force Swedish regardless of any persisted preference.
  const language: Language = LANGUAGE_SELECT_ENABLED ? storedLanguage : 'sv';

  // Guard against a level persisted before level 4 was dropped (or any out-of-range value).
  const level = (LEVELS as readonly number[]).includes(lastLevel) ? lastLevel : LEVELS[0];

  const t = TRANSLATIONS[language];
  const playClick = useClickSound(soundEnabled);
  const playTada = useTadaSound(soundEnabled);

  const { state, startRound, respond, reset } = useNBackGame();

  useEffect(() => {
    if (state.phase === 'summary' && state.lastResult) {
      setHistory([...history, state.lastResult].slice(-HISTORY_LIMIT));
      playTada();
    }
    // history/playTada intentionally omitted — only fire once when a round completes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.lastResult]);

  const handleStart = () => {
    const set = STIMULUS_SETS.find((s) => s.id === lastStimulusType) ?? STIMULUS_SETS[0];
    startRound(level, lastStimulusType, set.items, roundLength);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) {
      playClick();
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12"
      onClickCapture={handleClickCapture}
    >
      <header className="text-center">
        <h1 className="text-2xl font-semibold text-slate-700">{t.appTitle}</h1>
        <p className="text-sm text-slate-400">{t.appSubtitle}</p>
      </header>

      {state.phase === 'select' && (
        <div className="flex w-full max-w-md flex-col gap-8 rounded-3xl bg-white/60 p-8">
          <LevelSelect value={level} onChange={setLastLevel} t={t} />
          <StimulusTypeSelect value={lastStimulusType} onChange={setLastStimulusType} t={t} />
          <RoundLengthSelect value={roundLength} onChange={setRoundLength} t={t} />
          {LANGUAGE_SELECT_ENABLED && <LanguageSelect value={language} onChange={setLanguage} t={t} />}
          <SoundToggle value={soundEnabled} onChange={setSoundEnabled} t={t} />
          <button
            type="button"
            onClick={handleStart}
            className="mt-2 rounded-full bg-sky-500 px-8 py-3 text-base font-medium text-white transition active:scale-95 hover:bg-sky-600"
          >
            {t.startButton}
          </button>
        </div>
      )}

      {state.phase === 'playing' && (
        <div className="flex flex-col items-center gap-10">
          <StimulusDisplay
            stimulus={state.trials[state.currentIndex].stimulus}
            level={state.level}
            currentTrial={state.currentIndex + 1}
            totalTrials={state.trials.length}
            t={t}
          />
          <ResponseControls
            canMatch={state.currentIndex >= state.level}
            onRespond={respond}
            t={t}
          />
          <button
            type="button"
            onClick={reset}
            className="text-sm text-slate-400 underline-offset-4 transition active:scale-95 hover:text-slate-600 hover:underline"
          >
            {t.cancelButton}
          </button>
        </div>
      )}

      {state.phase === 'summary' && state.lastResult && (
        <RoundSummary
          result={state.lastResult}
          history={history}
          onPlayAgain={handleStart}
          onChangeLevel={reset}
          t={t}
        />
      )}
    </div>
  );
}

export default App;
