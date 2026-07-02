import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNBackGame } from './hooks/useNBackGame';
import { LEVELS } from './lib/levels';
import type { Level } from './lib/levels';
import { STIMULUS_SETS } from './lib/stimulusSets';
import type { RoundResult, StimulusTypeId } from './lib/types';
import { TRANSLATIONS } from './lib/i18n';
import type { Language } from './lib/i18n';
import { LevelSelect } from './components/LevelSelect';
import { StimulusTypeSelect } from './components/StimulusTypeSelect';
import { LanguageSelect } from './components/LanguageSelect';
import { StimulusDisplay } from './components/StimulusDisplay';
import { ResponseControls } from './components/ResponseControls';
import { RoundSummary } from './components/RoundSummary';

const HISTORY_LIMIT = 50;
const DEFAULT_LANGUAGE: Language = navigator.language.toLowerCase().startsWith('sv') ? 'sv' : 'en';

function App() {
  const [lastLevel, setLastLevel] = useLocalStorage<Level>('nback:lastLevel', LEVELS[0]);
  const [lastStimulusType, setLastStimulusType] = useLocalStorage<StimulusTypeId>(
    'nback:lastStimulusType',
    STIMULUS_SETS[0].id
  );
  const [language, setLanguage] = useLocalStorage<Language>('nback:language', DEFAULT_LANGUAGE);
  const [history, setHistory] = useLocalStorage<RoundResult[]>('nback:history', []);

  const t = TRANSLATIONS[language];

  const { state, startRound, markMatch, advance, reset } = useNBackGame();

  useEffect(() => {
    if (state.phase === 'summary' && state.lastResult) {
      setHistory([...history, state.lastResult].slice(-HISTORY_LIMIT));
    }
    // history intentionally omitted from deps — only append once when a round completes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.lastResult]);

  const handleStart = () => {
    const set = STIMULUS_SETS.find((s) => s.id === lastStimulusType) ?? STIMULUS_SETS[0];
    startRound(lastLevel, lastStimulusType, set.items);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <header className="text-center">
        <h1 className="text-2xl font-semibold text-slate-700">{t.appTitle}</h1>
        <p className="text-sm text-slate-400">{t.appSubtitle}</p>
      </header>

      {state.phase === 'select' && (
        <div className="flex w-full max-w-md flex-col gap-8 rounded-3xl bg-white/60 p-8">
          <LevelSelect value={lastLevel} onChange={setLastLevel} t={t} />
          <StimulusTypeSelect value={lastStimulusType} onChange={setLastStimulusType} t={t} />
          <LanguageSelect value={language} onChange={setLanguage} t={t} />
          <button
            type="button"
            onClick={handleStart}
            className="mt-2 rounded-full bg-sky-500 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-sky-600"
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
            hasMarkedMatch={Boolean(state.responses[state.currentIndex])}
            isLastTrial={state.currentIndex === state.trials.length - 1}
            onMatch={markMatch}
            onAdvance={advance}
            t={t}
          />
          <button
            type="button"
            onClick={reset}
            className="text-sm text-slate-400 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
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
