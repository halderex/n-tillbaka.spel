import type { Trial } from './types';

const TARGET_MATCH_RATE = 0.3;

export function generateSequence(
  items: string[],
  n: number,
  length: number,
  targetMatchRate = TARGET_MATCH_RATE
): Trial[] {
  const sequence: string[] = [];
  const trials: Trial[] = [];

  for (let i = 0; i < length; i++) {
    let stimulus: string;
    let isMatch = false;

    if (i >= n && Math.random() < targetMatchRate) {
      stimulus = sequence[i - n];
      isMatch = true;
    } else {
      do {
        stimulus = items[Math.floor(Math.random() * items.length)];
      } while (i >= n && stimulus === sequence[i - n]);
    }

    sequence.push(stimulus);
    trials.push({ index: i, stimulus, isMatch });
  }

  return trials;
}
