import type { StimulusTypeId } from './types';

export type Language = 'en' | 'sv';

export const LANGUAGES: { id: Language; nativeLabel: string }[] = [
  { id: 'en', nativeLabel: 'English' },
  { id: 'sv', nativeLabel: 'Svenska' },
];

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  languagePrompt: string;
  soundOnLabel: string;
  soundOffLabel: string;
  stepsBackPrompt: string;
  whatToShowPrompt: string;
  roundLengthPrompt: string;
  startButton: string;
  levelLabel: (level: number) => string;
  trialProgress: (current: number, total: number) => string;
  matchButton: string;
  noMatchButton: string;
  cancelButton: string;
  summaryTagline: string;
  matchesCaught: string;
  matchesMissed: string;
  extraFlags: string;
  totalTrials: string;
  playAgain: string;
  changeLevel: string;
  recentRounds: string;
  stimulusLabels: Record<StimulusTypeId, string>;
}

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    appTitle: 'n-tillbaka',
    appSubtitle: 'a calm memory game, no rush',
    languagePrompt: 'Language',
    soundOnLabel: '🔊 Sound on',
    soundOffLabel: '🔇 Sound off',
    stepsBackPrompt: 'How many steps back?',
    whatToShowPrompt: 'What should we show?',
    roundLengthPrompt: 'How many items per round?',
    startButton: 'Start',
    levelLabel: (level) => `Level ${level}`,
    trialProgress: (current, total) => `Trial ${current} of ${total}`,
    matchButton: 'This matches!',
    noMatchButton: 'No match',
    cancelButton: 'Cancel',
    summaryTagline: 'nice and steady — no rush',
    matchesCaught: 'Matches caught',
    matchesMissed: 'Matches missed',
    extraFlags: 'Extra flags',
    totalTrials: 'Total trials',
    playAgain: 'Play again',
    changeLevel: 'Change level',
    recentRounds: 'Recent rounds',
    stimulusLabels: {
      letters: 'Letters',
      numbers: 'Numbers',
      emoji: 'Pictures',
    },
  },
  sv: {
    appTitle: 'n-tillbaka',
    appSubtitle: 'ett lugnt minnesspel, utan stress',
    languagePrompt: 'Språk',
    soundOnLabel: '🔊 Ljud på',
    soundOffLabel: '🔇 Ljud av',
    stepsBackPrompt: 'Hur många steg tillbaka?',
    whatToShowPrompt: 'Vad ska vi visa?',
    roundLengthPrompt: 'Hur många objekt per omgång?',
    startButton: 'Starta',
    levelLabel: (level) => `Nivå ${level}`,
    trialProgress: (current, total) => `Försök ${current} av ${total}`,
    matchButton: 'Det här matchar!',
    noMatchButton: 'Matchar inte',
    cancelButton: 'Avbryt',
    summaryTagline: 'lugnt och stadigt — ta det i din takt',
    matchesCaught: 'Fångade matchningar',
    matchesMissed: 'Missade matchningar',
    extraFlags: 'Extra markeringar',
    totalTrials: 'Antal försök',
    playAgain: 'Spela igen',
    changeLevel: 'Byt nivå',
    recentRounds: 'Senaste omgångarna',
    stimulusLabels: {
      letters: 'Bokstäver',
      numbers: 'Siffror',
      emoji: 'Bilder',
    },
  },
};
