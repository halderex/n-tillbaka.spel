import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'stimulus-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'stimulus-in': 'stimulus-in 300ms ease-out',
      },
    },
  },
  plugins: [
    // Scope `hover:` to devices that actually support hovering, so touchscreens
    // don't get a "stuck" hover style after tapping a button (no mouseleave to clear it).
    plugin(({ addVariant }) => {
      addVariant('hover', '@media (hover: hover) { &:hover }');
    }),
  ],
};
