// Animation configuration
export const animations = {
  keyframes: {
    'accordion-down': {
      from: {
        height: '0'
      },
      to: {
        height: 'var(--radix-accordion-content-height)'
      }
    },
    'accordion-up': {
      from: {
        height: 'var(--radix-accordion-content-height)'
      },
      to: {
        height: '0'
      }
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
        animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" 
      },
      "50%": { 
        transform: "translateY(-10px)",
        animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" 
      },
    },
    "glow": {
      "0%, 100%": {
        boxShadow: "0 0 5px rgba(79, 70, 229, 0.7)",
      },
      "50%": {
        boxShadow: "0 0 20px rgba(79, 70, 229, 0.9)",
      },
    },
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    "spin-slow": "spin-slow 5s linear infinite",
    "bounce-slow": "bounce-slow 2s infinite",
    "glow": "glow 2s ease-in-out infinite",
  }
};