export type StimulusTypeId = 'letters' | 'numbers' | 'emoji';

export interface StimulusSet {
  id: StimulusTypeId;
  items: string[];
}

export interface Trial {
  index: number;
  stimulus: string;
  isMatch: boolean;
}

export interface RoundResult {
  timestamp: string;
  level: number;
  stimulusType: StimulusTypeId;
  totalTrials: number;
  correctMatches: number;
  missedMatches: number;
  falseAlarms: number;
  correctRejections: number;
}
