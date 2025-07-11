import type { Config } from "tailwindcss";
import { colors } from './src/config/tailwind/colors';
import { typography } from './src/config/tailwind/typography';
import { layout } from './src/config/tailwind/layout';
import { animations } from './src/config/tailwind/animations';

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    ...layout,
    extend: {
      ...typography,
      colors,
      ...layout,
      ...animations
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;