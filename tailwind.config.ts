// tailwind.config.ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2183C6',
        muted: { DEFAULT: '#f3f4f6', foreground: '#6b7280' },
        card: { DEFAULT: '#ffffff', foreground: '#111827' },
        border: '#e5e7eb',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)',
      },
    },
  },
  plugins: [],
}
export default config
