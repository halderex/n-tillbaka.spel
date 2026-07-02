export const LEVELS = [1, 2, 3, 4] as const;

export type Level = (typeof LEVELS)[number];

export const ROUND_LENGTH = 20;
