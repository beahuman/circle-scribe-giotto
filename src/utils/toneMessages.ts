export type ToneType = 'meditative' | 'playful' | 'formal' | 'sarcastic' | 'poetic' | 'existential' | 'romantic';

export interface ToneTheme {
  id: string;
  name: string;
  description: string;
  unlockRequirement: number; // Number of uses to unlock
  visualStyle: {
    background?: string;
    accent?: string;
    effects?: string[];
  };
}

export const TONE_THEMES: Record<ToneType, ToneTheme> = {
  meditative: {
    id: 'zen-brush',
    name: 'Zen Brush',
    description: 'Subtle ink trails, faded canvas background',
    unlockRequirement: 5,
    visualStyle: {
      background: 'bg-gradient-to-br from-slate-50 to-stone-100',
      accent: 'text-stone-600',
      effects: ['ink-trail', 'faded-canvas']
    }
  },
  playful: {
    id: 'confetti-pop',
    name: 'Confetti Pop',
    description: 'Bright accent colors, bubbly tap effects',
    unlockRequirement: 5,
    visualStyle: {
      background: 'bg-gradient-to-br from-pink-50 to-purple-50',
      accent: 'text-purple-600',
      effects: ['confetti', 'bubble-taps']
    }
  },
  formal: {
    id: 'blueprint-mode',
    name: 'Blueprint Mode',
    description: 'Grid overlays, clean technical lines',
    unlockRequirement: 5,
    visualStyle: {
      background: 'bg-gradient-to-br from-blue-50 to-slate-100',
      accent: 'text-blue-700',
      effects: ['grid-overlay', 'technical-lines']
    }
  },
  sarcastic: {
    id: 'redacted-mode',
    name: 'Redacted Mode',
    description: 'Bold black bars, snarky labels, glitch pops',
    unlockRequirement: 5,
    visualStyle: {
      background: 'bg-gradient-to-br from-red-50 to-orange-50',
      accent: 'text-red-700',
      effects: ['redacted-bars', 'glitch-pops']
    }
  },
  poetic: {
    id: 'dreamline',
    name: 'Dreamline',
    description: 'Faint gradient haze, handwritten accents',
    unlockRequirement: 8,
    visualStyle: {
      background: 'bg-gradient-to-br from-indigo-50 to-cyan-50',
      accent: 'text-indigo-600',
      effects: ['gradient-haze', 'handwritten']
    }
  },
  existential: {
    id: 'voidspace',
    name: 'Voidspace',
    description: 'Gray-on-gray with circular ripple pulses',
    unlockRequirement: 10,
    visualStyle: {
      background: 'bg-gradient-to-br from-gray-100 to-slate-200',
      accent: 'text-gray-700',
      effects: ['ripple-pulses', 'void-aesthetic']
    }
  },
  romantic: {
    id: 'amour',
    name: 'Amour',
    description: 'Floral overlays, pink accents, subtle sparkle FX',
    unlockRequirement: 10,
    visualStyle: {
      background: 'bg-gradient-to-br from-rose-50 to-pink-50',
      accent: 'text-rose-600',
      effects: ['floral-overlay', 'sparkle-fx']
    }
  }
};

export const TONE_MESSAGES = {
  // Score feedback messages
  scoreMessages: {
    meditative: {
      excellent: "You moved with awareness.",
      good: "Steady breath. Steady hand.",
      fair: "The path reveals itself through practice.",
      poor: "Each attempt deepens understanding."
    },
    playful: {
      excellent: "That circle had serious style! 🎯",
      good: "You're spiraling in a good way! ✨",
      fair: "Getting warmer! Your thumb's learning.",
      poor: "Even Picasso had rough sketches. Keep going!"
    },
    formal: {
      excellent: "Symmetry score: Exceptional. Deviation: Minimal.",
      good: "Control trending upward. Parameters within range.",
      fair: "Performance: Adequate. Room for optimization.",
      poor: "Analysis complete. Recalibration recommended."
    },
    sarcastic: {
      excellent: "Did you cheat? That was suspiciously perfect.",
      good: "Not terrible. Your geometry teacher would be proud.",
      fair: "That's... a shape. Technically circular-ish.",
      poor: "You've insulted geometry itself. Impressive."
    }
  },

  // Motivational phrases for home screen
  motivationalPhrases: {
    meditative: [
      "One stroke. One breath. One circle.",
      "Center yourself. Find the curve.",
      "In stillness, precision emerges."
    ],
    playful: [
      "Today's a good day to impress your thumb.",
      "Ready to make some perfectly imperfect circles?",
      "Your daily dose of geometric fun awaits!"
    ],
    formal: [
      "Precision through repetition and neural optimization.",
      "Initiating motor skill calibration protocol.",
      "Systematic improvement through controlled practice."
    ],
    sarcastic: [
      "Back for more punishment, are we?",
      "Ready to disappoint your high school math teacher?",
      "Let's see what creative disasters await today."
    ]
  },

  // Streak messages
  streakMessages: {
    meditative: {
      start: "Your journey begins with mindful repetition.",
      continue: "Each day strengthens your inner compass.",
      milestone: "Seven days of focused practice. Your awareness deepens."
    },
    playful: {
      start: "Day 1 down! You're on fire! 🔥",
      continue: "Streak master! Keep the momentum rolling!",
      milestone: "7-day streak champion! You're unstoppable!"
    },
    formal: {
      start: "Streak protocol initiated. Consistency metrics tracking.",
      continue: "Routine maintenance: On schedule. Progress: Measured.",
      milestone: "Week 1 complete. Neural pathway formation confirmed."
    },
    sarcastic: {
      start: "Congratulations, you did the bare minimum.",
      continue: "Look who's being all consistent. Show off.",
      milestone: "A whole week? Someone deserves a cookie."
    }
  },

  // Badge unlock messages
  badgeMessages: {
    meditative: {
      unlock: "A new understanding has emerged.",
      description: "Recognition of your growing mastery."
    },
    playful: {
      unlock: "New badge unlocked! You're collecting achievements! 🏆",
      description: "Another shiny reward for your awesome skills!"
    },
    formal: {
      unlock: "Achievement parameters met. Badge authorization granted.",
      description: "Performance milestone documented and filed."
    },
    sarcastic: {
      unlock: "Well, well. Look who earned a participation trophy.",
      description: "A badge for doing what you're supposed to do. Revolutionary."
    }
  },

  // Mode unlock messages
  modeUnlocks: {
    blindDraw: {
      meditative: "Sight fades. Focus sharpens.",
      playful: "You're drawing with your brain now! 🧠✨",
      formal: "Proprioception training module: Activated.",
      sarcastic: "Don't blame us when this goes badly."
    }
  }
};

export function getScoreMessage(tone: ToneType, score: number): string {
  const messages = TONE_MESSAGES.scoreMessages[tone];
  if (score >= 90) return messages.excellent;
  if (score >= 75) return messages.good;
  if (score >= 50) return messages.fair;
  return messages.poor;
}

export function getMotivationalPhrase(tone: ToneType): string {
  const phrases = TONE_MESSAGES.motivationalPhrases[tone];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getStreakMessage(tone: ToneType, streakLength: number): string {
  const messages = TONE_MESSAGES.streakMessages[tone];
  if (streakLength === 1) return messages.start;
  if (streakLength >= 7) return messages.milestone;
  return messages.continue;
}

export function getBadgeUnlockMessage(tone: ToneType): string {
  return TONE_MESSAGES.badgeMessages[tone].unlock;
}

export function getModeUnlockMessage(tone: ToneType, mode: keyof typeof TONE_MESSAGES.modeUnlocks): string {
  return TONE_MESSAGES.modeUnlocks[mode][tone];
}