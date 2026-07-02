import type { RoundResult } from '../lib/types';
import type { Translation } from '../lib/i18n';

interface RoundSummaryProps {
  result: RoundResult;
  history: RoundResult[];
  onPlayAgain: () => void;
  onChangeLevel: () => void;
  t: Translation;
}

export function RoundSummary({ result, history, onPlayAgain, onChangeLevel, t }: RoundSummaryProps) {
  const accuracy = Math.round(
    ((result.correctMatches + result.correctRejections) / result.totalTrials) * 100
  );

  const recent = history.slice(-5).reverse();

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-400">
          {result.level}-back · {t.stimulusLabels[result.stimulusType]}
        </p>
        <p className="mt-2 text-5xl font-semibold text-sky-600">{accuracy}%</p>
        <p className="mt-1 text-sm text-slate-500">{t.summaryTagline}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-left text-sm">
          <div>
            <dt className="text-slate-400">{t.matchesCaught}</dt>
            <dd className="font-medium text-slate-700">{result.correctMatches}</dd>
          </div>
          <div>
            <dt className="text-slate-400">{t.matchesMissed}</dt>
            <dd className="font-medium text-slate-700">{result.missedMatches}</dd>
          </div>
          <div>
            <dt className="text-slate-400">{t.extraFlags}</dt>
            <dd className="font-medium text-slate-700">{result.falseAlarms}</dd>
          </div>
          <div>
            <dt className="text-slate-400">{t.totalTrials}</dt>
            <dd className="font-medium text-slate-700">{result.totalTrials}</dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full bg-sky-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-sky-600"
        >
          {t.playAgain}
        </button>
        <button
          type="button"
          onClick={onChangeLevel}
          className="rounded-full bg-white px-6 py-3 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          {t.changeLevel}
        </button>
      </div>

      {recent.length > 0 && (
        <div className="w-full">
          <p className="mb-2 text-sm font-medium text-slate-400">{t.recentRounds}</p>
          <ul className="flex flex-col gap-1 text-sm text-slate-500">
            {recent.map((r) => (
              <li key={r.timestamp} className="flex justify-between rounded-lg bg-white px-4 py-2 shadow-sm">
                <span>
                  {r.level}-back · {t.stimulusLabels[r.stimulusType]}
                </span>
                <span className="font-medium text-slate-700">
                  {Math.round(((r.correctMatches + r.correctRejections) / r.totalTrials) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
