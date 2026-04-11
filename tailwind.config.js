export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 80px rgba(131, 58, 180, 0.25)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 36%), linear-gradient(120deg, #0f172a 0%, #020617 100%)',
      },
    },
  },
  plugins: [],
};
