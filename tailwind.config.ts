import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Responsive breakpoints
      screens: {
        xs: "480px", // Mobile
        sm: "640px", // Mobile Large
        md: "768px", // Tablet Portrait
        lg: "1024px", // Tablet Landscape
        xl: "1280px", // Desktop (not used)
        "2xl": "1536px", // Desktop Large (not used)
      },
      fontFamily: {
        sans: ["SF Pro Rounded", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Tone-based color system
        "tone-playful": {
          primary: "hsl(var(--tone-playful-primary))",
          secondary: "hsl(var(--tone-playful-secondary))",
          accent: "hsl(var(--tone-playful-accent))",
          background: "hsl(var(--tone-playful-background))",
          surface: "hsl(var(--tone-playful-surface))",
          text: "hsl(var(--tone-playful-text))",
          "text-muted": "hsl(var(--tone-playful-text-muted))",
        },
        "tone-meditative": {
          primary: "hsl(var(--tone-meditative-primary))",
          secondary: "hsl(var(--tone-meditative-secondary))",
          accent: "hsl(var(--tone-meditative-accent))",
          background: "hsl(var(--tone-meditative-background))",
          surface: "hsl(var(--tone-meditative-surface))",
          text: "hsl(var(--tone-meditative-text))",
          "text-muted": "hsl(var(--tone-meditative-text-muted))",
        },
        "tone-formal": {
          primary: "hsl(var(--tone-formal-primary))",
          secondary: "hsl(var(--tone-formal-secondary))",
          accent: "hsl(var(--tone-formal-accent))",
          background: "hsl(var(--tone-formal-background))",
          surface: "hsl(var(--tone-formal-surface))",
          text: "hsl(var(--tone-formal-text))",
          "text-muted": "hsl(var(--tone-formal-text-muted))",
        },
        "tone-sarcastic": {
          primary: "hsl(var(--tone-sarcastic-primary))",
          secondary: "hsl(var(--tone-sarcastic-secondary))",
          accent: "hsl(var(--tone-sarcastic-accent))",
          background: "hsl(var(--tone-sarcastic-background))",
          surface: "hsl(var(--tone-sarcastic-surface))",
          text: "hsl(var(--tone-sarcastic-text))",
          "text-muted": "hsl(var(--tone-sarcastic-text-muted))",
        },
        // Score and feedback colors
        score: {
          excellent: "hsl(var(--score-excellent))",
          good: "hsl(var(--score-good))",
          fair: "hsl(var(--score-fair))",
          poor: "hsl(var(--score-poor))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
      },
      borderRadius: {
        sm: "var(--radius-sm)", /* 4px - micro elements */
        md: "var(--radius-md)", /* 8px - small components */
        lg: "var(--radius-lg)", /* 12px - buttons, cards, modals */
        xl: "var(--radius-xl)", /* 16px - large cards */
        full: "var(--radius-full)", /* badges, pills, streaks */
      },
      fontSize: {
        score: ["var(--text-score)", { lineHeight: "1", fontWeight: "700" }],
        header: ["var(--text-header)", { lineHeight: "1.2", fontWeight: "600" }],
        subheader: ["var(--text-subheader)", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["var(--text-body)", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["var(--text-small)", { lineHeight: "1.4", fontWeight: "400" }],
        caption: ["var(--text-caption)", { lineHeight: "1.3", fontWeight: "500" }],
        placeholder: [
          "var(--text-placeholder)",
          { lineHeight: "1.4", fontWeight: "400", fontStyle: "italic" },
        ],
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-10px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(79, 70, 229, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(79, 70, 229, 0.9)",
          },
        },
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 5s linear infinite",
        "bounce-slow": "bounce-slow 2s infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;