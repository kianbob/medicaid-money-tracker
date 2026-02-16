import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0b0f',
          800: '#12141c',
          700: '#1a1d2b',
          600: '#232839',
          500: '#2d3348',
        },
        accent: {
          red: '#ef4444',
          amber: '#f59e0b',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#a855f7',
        }
      }
    },
  },
  plugins: [],
};
export default config;
