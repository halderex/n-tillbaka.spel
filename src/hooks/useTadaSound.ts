import { useCallback, useRef } from 'react';

// A cheerful ascending major arpeggio (C5-E5-G5-C6) played when a round finishes.
const NOTES = [523.25, 659.25, 783.99, 1046.5];
const NOTE_SPACING = 0.12;

export function useTadaSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (!enabled) return;

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const start = ctx.currentTime;

    NOTES.forEach((freq, i) => {
      const noteStart = start + i * NOTE_SPACING;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      // The final (top) note rings out longer for a "ta-daa!" resolve.
      const duration = i === NOTES.length - 1 ? 0.5 : 0.18;
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + duration);
    });
  }, [enabled]);
}
