export type ToneType = 'calm' | 'playful' | 'formal' | 'sarcastic' | 'poetic' | 'existential' | 'romantic' | 'philosophical' | 'darkHumor';

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
  calm: {
    id: 'zen-brush',
    name: 'Zen Brush',
    description: 'Subtle ink trails, faded canvas background',
    unlockRequirement: 5,
    visualStyle: {
      background: 'from-tone-meditative-background to-tone-meditative-surface',
      accent: 'text-tone-meditative-accent',
      effects: ['ink-trail', 'faded-canvas']
    }
  },
  playful: {
    id: 'confetti-pop',
    name: 'Confetti Pop',
    description: 'Bright accent colors, bubbly tap effects',
    unlockRequirement: 5,
    visualStyle: {
      background: 'from-tone-playful-background to-tone-playful-surface',
      accent: 'text-tone-playful-accent',
      effects: ['confetti', 'bubble-taps']
    }
  },
  formal: {
    id: 'blueprint-mode',
    name: 'Blueprint Mode',
    description: 'Grid overlays, clean technical lines',
    unlockRequirement: 5,
    visualStyle: {
      background: 'from-tone-formal-background to-tone-formal-surface',
      accent: 'text-tone-formal-accent',
      effects: ['grid-overlay', 'technical-lines']
    }
  },
  sarcastic: {
    id: 'redacted-mode',
    name: 'Redacted Mode',
    description: 'Bold black bars, snarky labels, glitch pops',
    unlockRequirement: 5,
    visualStyle: {
      background: 'from-tone-sarcastic-background to-tone-sarcastic-surface',
      accent: 'text-tone-sarcastic-accent',
      effects: ['redacted-lines', 'glitch-text']
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
  },
  philosophical: {
    id: 'scholar-mode',
    name: 'Scholar Mode',
    description: 'Parchment texture, serif text, ancient wisdom vibes',
    unlockRequirement: 12,
    visualStyle: {
      background: 'bg-gradient-to-br from-amber-50 to-orange-50',
      accent: 'text-amber-700',
      effects: ['parchment-texture', 'ancient-wisdom']
    }
  },
  darkHumor: {
    id: 'noir-mode',
    name: 'Noir Mode',
    description: 'High contrast blacks, sharp edges, dramatic shadows',
    unlockRequirement: 12,
    visualStyle: {
      background: 'bg-gradient-to-br from-gray-900 to-slate-800',
      accent: 'text-gray-300',
      effects: ['noir-shadows', 'high-contrast']
    }
  }
};

export const TONE_MESSAGES = {
  // Score feedback messages - Volume 1
  scoreMessages: {
    calm: {
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
    },
    poetic: {
      excellent: "A perfect sphere born from intention.",
      good: "Beauty emerges from your flowing gesture.",
      fair: "Your circle whispers of potential.",
      poor: "Even rough stones can become smooth."
    },
    existential: {
      excellent: "Perfect circles in an imperfect universe.",
      good: "Meaning through precision in meaningless space.",
      fair: "Attempting order amidst chaos.",
      poor: "Another futile gesture toward perfection."
    },
    romantic: {
      excellent: "A circle worthy of love letters!",
      good: "Your touch dances gracefully across the screen.",
      fair: "Like a first kiss - sweet, if imperfect.",
      poor: "Even broken hearts can learn to love again."
    },
    philosophical: {
      excellent: "In this circle, we contemplate perfection itself.",
      good: "Your hand embodies the wisdom of geometric truth.",
      fair: "Imperfection teaches us what perfection truly means.",
      poor: "Even Socrates would have struggled with touchscreens."
    },
    darkHumor: {
      excellent: "Well, that's one circle that won't disappoint you.",
      good: "Decent work. Unlike most things in life.",
      fair: "At least you're consistently average at something.",
      poor: "Join the club of disappointment. We meet in circles."
    }
  },

  // Score feedback messages - Volume 2 (unlocked after 15 uses)
  scoreMessagesV2: {
    calm: {
      excellent: "Perfect stillness in motion achieved.",
      good: "Your center is finding its voice.",
      fair: "Patience teaches what haste cannot.",
      poor: "The circle teaches through imperfection."
    },
    playful: {
      excellent: "You're basically a circle wizard now! 🧙‍♂️",
      good: "That was less wobbly! Color me impressed.",
      fair: "Your finger's getting the hang of this dance!",
      poor: "Hey, at least it's round-ish! Progress!"
    },
    formal: {
      excellent: "This performance approaches acceptable symmetry.",
      good: "Improvement has been noted and documented.",
      fair: "Marginal advancement detected in motor precision.",
      poor: "Current trajectory requires course correction."
    },
    sarcastic: {
      excellent: "Wow, 97%. You must be... thrilled.",
      good: "Another almost-circle. A masterpiece of mediocrity.",
      fair: "That's definitely... something resembling round.",
      poor: "I've seen better circles drawn by earthquakes."
    },
    poetic: {
      excellent: "Your soul speaks fluent geometry today.",
      good: "Grace flows through your fingertips like ink.",
      fair: "Art emerges even from uncertain strokes.",
      poor: "Beauty hides within the seemingly imperfect."
    },
    existential: {
      excellent: "Perfection in a void of imperfection.",
      good: "Finding meaning in circular repetition.",
      fair: "We circle, therefore we are... something.",
      poor: "Even failure circles back to meaning."
    },
    romantic: {
      excellent: "A circle that would make poets weep with joy!",
      good: "Your devotion to form is absolutely enchanting.",
      fair: "Like vintage wine - imperfect but charming.",
      poor: "Every love story has its rough chapters."
    },
    philosophical: {
      excellent: "Behold: The circle as pure form, perfectly realized.",
      good: "Your understanding of geometric essence deepens.",
      fair: "Consider how this relates to the nature of being.",
      poor: "Even failure teaches us about the human condition."
    },
    darkHumor: {
      excellent: "Shocking. Something actually went right for once.",
      good: "Don't get used to success. It's temporary.",
      fair: "Mediocrity: At least it's consistent.",
      poor: "Welcome to the abyss of circular disappointment."
    }
  },

  // Motivational phrases for home screen - Volume 1
  motivationalPhrases: {
    calm: [
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
    ],
    poetic: [
      "Today, your finger writes poetry in circles.",
      "Inscribe perfect arcs upon the digital canvas.",
      "Let your soul speak through circular motion."
    ],
    existential: [
      "Drawing circles to fill the void.",
      "Why do we circle? Why do we exist?",
      "Perfect curves in an imperfect reality."
    ],
    romantic: [
      "Draw circles like love letters to yourself.",
      "Your touch creates beauty worth admiring.",
      "Each circle is a small act of self-care."
    ],
    philosophical: [
      "What is a circle but the universe contemplating itself?",
      "Today, explore the metaphysics of perfect curves.",
      "In drawing circles, we examine the nature of completion."
    ],
    darkHumor: [
      "Time to disappoint yourself in a perfectly circular way.",
      "Another day, another futile attempt at geometric perfection.",
      "Drawing circles to distract from life's meaninglessness."
    ]
  },

  // Motivational phrases for home screen - Volume 2
  motivationalPhrasesV2: {
    calm: [
      "Breathe deeply. Your circle awaits your mindful touch.",
      "Today, let tranquility guide your geometry.",
      "Find your rhythm in the eternal curve."
    ],
    playful: [
      "Time to show circles who's boss! 💪",
      "Your finger is ready for some circular mischief!",
      "Let's turn today into a shape celebration!"
    ],
    formal: [
      "Commencing advanced motor pattern reinforcement.",
      "Today's objective: Optimize circular trajectory output.",
      "Prepare for enhanced geometric precision training."
    ],
    sarcastic: [
      "Another day, another chance to mess up basic shapes.",
      "Hope you're ready to be humbled by geometry again.",
      "Time to see if yesterday taught you anything."
    ],
    poetic: [
      "Your canvas awaits the dance of perfect arcs.",
      "Let circles be the verses of your digital poetry.",
      "Today, geometry becomes your muse."
    ],
    existential: [
      "Circle to escape the endless linear nature of time.",
      "Round and round we go, but why?",
      "Creating meaning through repetitive perfection."
    ],
    romantic: [
      "Your circles deserve all the love in the world today.",
      "Touch the screen with the tenderness of a lover.",
      "Make every stroke a promise of beautiful imperfection."
    ],
    philosophical: [
      "Ponder: Is the perfect circle an ideal we can never reach?",
      "Today, let geometry become your meditation on form.",
      "Draw circles to understand the essence of completion."
    ],
    darkHumor: [
      "Back to make more imperfect circles in an imperfect world.",
      "At least your circles match your life: mostly disappointing.",
      "Time to fail at basic geometry again. How refreshing."
    ]
  },

  // Streak messages
  streakMessages: {
    calm: {
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
    },
    poetic: {
      start: "The first verse in your daily ritual begins.",
      continue: "Your consistency writes beautiful verses.",
      milestone: "A week of poetry in motion completed."
    },
    existential: {
      start: "Day one of your meaningless but necessary routine.",
      continue: "Persisting despite the absurdity of it all.",
      milestone: "Seven days of defying the void through circles."
    },
    romantic: {
      start: "Your love affair with circles begins.",
      continue: "This daily romance grows stronger.",
      milestone: "A week of devoted practice - true commitment!"
    },
    philosophical: {
      start: "Thus begins your contemplation of circular truth.",
      continue: "Each day deepens your understanding of form.",
      milestone: "Seven days of geometric meditation completed."
    },
    darkHumor: {
      start: "Day one of your slow descent into circular madness.",
      continue: "Still here? Impressive commitment to futility.",
      milestone: "A week of disappointment. Consistency at its finest."
    }
  },

  // Badge unlock messages
  badgeMessages: {
    calm: {
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
    },
    poetic: {
      unlock: "A badge blooms like a flower in recognition.",
      description: "Beauty acknowledges beauty."
    },
    existential: {
      unlock: "Achievement unlocked in this meaningless game.",
      description: "A digital trophy in an analog world."
    },
    romantic: {
      unlock: "Your dedication has won you a token of affection!",
      description: "A badge that proves your commitment to excellence."
    },
    philosophical: {
      unlock: "Achievement represents the eternal pursuit of perfection.",
      description: "Recognition of your contemplative progress."
    },
    darkHumor: {
      unlock: "Congratulations. Another meaningless digital trophy.",
      description: "At least someone acknowledges your existential dread."
    }
  },

  // Mode unlock messages
  modeUnlocks: {
    blindDraw: {
      calm: "Sight fades. Focus sharpens.",
      playful: "You're drawing with your brain now! 🧠✨",
      formal: "Proprioception training module: Activated.",
      sarcastic: "Don't blame us when this goes badly.",
      poetic: "Close your eyes and let intuition guide you.",
      existential: "Drawing blind in a world already blind to meaning.",
      romantic: "Trust your heart to guide your hand.",
      philosophical: "Remove sight to illuminate inner understanding.",
      darkHumor: "Great, now you can fail without even seeing it."
    }
  },

  // Brush unlock messages
  brushUnlock: {
    playful: ["Your control unlocks new expression!", "Time to paint the town... circular!", "New brush, new possibilities!"],
    calm: ["Tools reflect the state of mind.", "Form follows focus.", "Expression through intention."],
    formal: ["Drawing parameters expanded. New visual output available.", "Brush functionality unlocked. Precision maintained.", "Visual customization options increased."],
    sarcastic: ["Because apparently you needed more ways to mess up.", "Ooh, fancy new brush. Still won't fix your technique.", "New brush, same shaky hands."],
    poetic: ["A new instrument for your artistic symphony.", "Your brush collection grows like verses in a poem.", "Tools of beauty for creating beauty."],
    existential: ["Another meaningless tool in the void.", "New brushes cannot paint meaning into existence.", "More options in this absurd digital sandbox."],
    romantic: ["A new brush to express your creative passion!", "Every stroke will be infused with more love.", "Your artistic romance deepens with new tools."],
    philosophical: ["A tool is meaningless without contemplative purpose.", "New instruments for exploring geometric truth.", "Each brush represents a different path to understanding."],
    darkHumor: ["Another tool for your collection of disappointments.", "Great, more ways to make terrible circles.", "New brush, same crushing sense of inadequacy."]
  }
};

export function getScoreMessage(tone: ToneType, score: number, toneUsage: number = 0, forceVolume?: 'v1' | 'v2'): string {
  // Determine which volume to use
  let useV2 = false;
  
  if (forceVolume) {
    useV2 = forceVolume === 'v2';
  } else {
    // Use Volume 2 if unlocked (15+ uses) and randomly interleave with Volume 1
    useV2 = toneUsage >= 15 && Math.random() < 0.7; // 70% chance for V2 when unlocked
  }
  const messageSet = useV2 ? TONE_MESSAGES.scoreMessagesV2 : TONE_MESSAGES.scoreMessages;
  
  const messages = messageSet[tone];
  if (!messages) {
    // Fallback to playful if tone not found
    return TONE_MESSAGES.scoreMessages.playful.fair;
  }
  if (score >= 90) return messages.excellent;
  if (score >= 75) return messages.good;
  if (score >= 50) return messages.fair;
  return messages.poor;
}

export function getMotivationalPhrase(tone: ToneType, toneUsage: number = 0, forceVolume?: 'v1' | 'v2'): string {
  // Determine which volume to use
  let useV2 = false;
  
  if (forceVolume) {
    useV2 = forceVolume === 'v2';
  } else {
    // Use Volume 2 if unlocked (15+ uses) and randomly interleave with Volume 1
    useV2 = toneUsage >= 15 && Math.random() < 0.6; // 60% chance for V2 when unlocked
  }
  const phraseSet = useV2 ? TONE_MESSAGES.motivationalPhrasesV2 : TONE_MESSAGES.motivationalPhrases;
  
  const phrases = phraseSet[tone];
  if (!phrases || phrases.length === 0) {
    // Fallback to playful if tone not found
    return TONE_MESSAGES.motivationalPhrases.playful[0];
  }
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getStreakMessage(tone: ToneType, streakLength: number): string {
  const messages = TONE_MESSAGES.streakMessages[tone];
  if (!messages) {
    // Fallback to playful if tone not found
    return TONE_MESSAGES.streakMessages.playful.start;
  }
  if (streakLength === 1) return messages.start;
  if (streakLength >= 7) return messages.milestone;
  return messages.continue;
}

export function getBadgeUnlockMessage(tone: ToneType): string {
  const messages = TONE_MESSAGES.badgeMessages[tone];
  if (!messages) {
    // Fallback to playful if tone not found
    return TONE_MESSAGES.badgeMessages.playful.unlock;
  }
  return messages.unlock;
}

// Helper function to check if Volume 2 is unlocked for a tone
export function isToneV2Unlocked(toneUsage: number): boolean {
  return toneUsage >= 15;
}

// Helper function to get tone mastery level
export function getToneMasteryLevel(toneUsage: number): number {
  if (toneUsage >= 15) return 2;
  if (toneUsage >= 5) return 1;
  return 0;
}

export function getModeUnlockMessage(tone: ToneType, mode: keyof typeof TONE_MESSAGES.modeUnlocks): string {
  const modeMessages = TONE_MESSAGES.modeUnlocks[mode];
  if (!modeMessages || !modeMessages[tone]) {
    // Fallback to playful if tone not found
    return TONE_MESSAGES.modeUnlocks[mode]?.playful || "Mode unlocked!";
  }
  return modeMessages[tone];
}