export const LEVELS = [1, 2, 3] as const;

export type Level = (typeof LEVELS)[number];

export const ROUND_LENGTHS = [10, 20, 30] as const;

export type RoundLength = (typeof ROUND_LENGTHS)[number];

export const DEFAULT_ROUND_LENGTH: RoundLength = 20;
