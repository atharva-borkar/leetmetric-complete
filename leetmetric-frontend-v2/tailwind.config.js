/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── Golden Ratio Spacing (φ = 1.618) ────────────── */
      spacing: {
        'phi-xs': '8px',
        'phi-sm': '13px',
        'phi-md': '21px',
        'phi-lg': '34px',
        'phi-xl': '55px',
        'phi-2xl': '89px',
        'phi-3xl': '144px',
        'phi-4xl': '233px',
      },

      /* ── Bioluminescent Color Palette ──────────────────── */
      colors: {
        abyss: '#0a0e1a',
        navy: { DEFAULT: '#111827', light: '#1a2236' },
        cyan: {
          electric: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.15)',
          deep: '#0088cc',
        },
        phosphor: '#39ff85',
        amber: { solar: '#ffb830' },
        coral: '#ff4d6a',
        lavender: '#8b95b0',
        offwhite: '#e8edf5',
        surface: {
          dark: '#111827',
          raised: '#1a2236',
          light: '#f8f9fc',
          card: '#ffffff',
        },
      },

      /* ── Typography ──────────────────────────────────── */
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['55px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['34px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['21px', { lineHeight: '1.3' }],
      },

      /* ── Animations ──────────────────────────────────── */
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'draw': 'draw 1.5s ease forwards',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
      },

      /* ── Backdrop / Glass ────────────────────────────── */
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 240, 255, 0.2)',
        'glow-green': '0 0 20px rgba(57, 255, 133, 0.15)',
        'glow-amber': '0 0 20px rgba(255, 184, 48, 0.15)',
      },
    },
  },
  plugins: [],
};
