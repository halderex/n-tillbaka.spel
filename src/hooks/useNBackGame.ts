import { useCallback, useState } from 'react';
import { generateSequence } from '../lib/sequenceGenerator';
import type { RoundResult, StimulusTypeId, Trial } from '../lib/types';
import type { Level } from '../lib/levels';

type GamePhase = 'select' | 'playing' | 'summary';

interface GameState {
  phase: GamePhase;
  level: Level;
  stimulusType: StimulusTypeId;
  trials: Trial[];
  currentIndex: number;
  responses: boolean[];
  lastResult: RoundResult | null;
}

const initialState: GameState = {
  phase: 'select',
  level: 1,
  stimulusType: 'letters',
  trials: [],
  currentIndex: 0,
  responses: [],
  lastResult: null,
};

export function useNBackGame() {
  const [state, setState] = useState<GameState>(initialState);

  const startRound = useCallback(
    (level: Level, stimulusType: StimulusTypeId, items: string[], roundLength: number) => {
      const trials = generateSequence(items, level, roundLength);
      setState({
        phase: 'playing',
        level,
        stimulusType,
        trials,
        currentIndex: 0,
        responses: [],
        lastResult: null,
      });
    },
    []
  );

  const respond = useCallback((isMatch: boolean) => {
    setState((prev) => {
      if (prev.phase !== 'playing') return prev;

      const responses = [...prev.responses];
      if (isMatch) responses[prev.currentIndex] = true;

      const nextIndex = prev.currentIndex + 1;
      if (nextIndex < prev.trials.length) {
        return { ...prev, responses, currentIndex: nextIndex };
      }

      let correctMatches = 0;
      let missedMatches = 0;
      let falseAlarms = 0;
      let correctRejections = 0;

      prev.trials.forEach((trial, i) => {
        const responded = Boolean(responses[i]);
        if (trial.isMatch && responded) correctMatches++;
        else if (trial.isMatch && !responded) missedMatches++;
        else if (!trial.isMatch && responded) falseAlarms++;
        else correctRejections++;
      });

      const lastResult: RoundResult = {
        timestamp: new Date().toISOString(),
        level: prev.level,
        stimulusType: prev.stimulusType,
        totalTrials: prev.trials.length,
        correctMatches,
        missedMatches,
        falseAlarms,
        correctRejections,
      };

      return { ...prev, responses, phase: 'summary', lastResult };
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({ ...initialState, level: prev.level, stimulusType: prev.stimulusType }));
  }, []);

  return { state, startRound, respond, reset };
}
