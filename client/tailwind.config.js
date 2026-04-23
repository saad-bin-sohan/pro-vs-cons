export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", 'Georgia', 'serif'],
        ui: ["'DM Sans'", 'system-ui', '-apple-system', 'sans-serif'],
        sans: ["'DM Sans'", 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#C05621',
          hover: '#9C4519',
          subtle: '#FEF3E8',
          border: '#F6D5AA',
        },
      },
    },
  },
  plugins: [],
};
