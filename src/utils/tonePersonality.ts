
import { ToneType } from './toneMessages';

export interface TonePersonality {
  ctaRetry: string;
  settingsCopy: string;
  lockedModeText: string;
  navAltLabel: string;
  encouragement: string;
  modalHelper: string;
}

export const TONE_PERSONALITIES: Record<ToneType, TonePersonality> = {
  calm: {
    ctaRetry: "Try Again",
    settingsCopy: "Adjust your practice environment",
    lockedModeText: "This mode will unlock when you're ready. Practice brings clarity.",
    navAltLabel: "Mindful navigation",
    encouragement: "Take a breath and try once more",
    modalHelper: "Center yourself and continue"
  },
  playful: {
    ctaRetry: "Go Again!",
    settingsCopy: "Customize your fun zone",
    lockedModeText: "Ooh, this one's locked! Draw more circles to unlock the fun stuff! 🎨",
    navAltLabel: "Adventure awaits",
    encouragement: "Let's make some more circular magic!",
    modalHelper: "Ready for another round of awesomeness?"
  },
  formal: {
    ctaRetry: "Reattempt Exercise",
    settingsCopy: "Configure training parameters",
    lockedModeText: "Access restricted. Complete prerequisite training sessions to unlock.",
    navAltLabel: "Systematic progress",
    encouragement: "Continue systematic improvement",
    modalHelper: "Proceed with structured practice"
  },
  sarcastic: {
    ctaRetry: "Go Again, If You Dare",
    settingsCopy: "Tweak your inevitable disappointment",
    lockedModeText: "Oh look, another thing you can't access yet. How surprising.",
    navAltLabel: "Navigate your mediocrity",
    encouragement: "Sure, try again. Maybe this time will be different.",
    modalHelper: "Another chance to prove me wrong"
  },
  poetic: {
    ctaRetry: "Dance Once More",
    settingsCopy: "Compose your artistic sanctuary",
    lockedModeText: "This canvas awaits your readiness. Let your circles bloom first.",
    navAltLabel: "Journey through beauty",
    encouragement: "Let your spirit guide the next stroke",
    modalHelper: "Your creative soul beckons"
  },
  existential: {
    ctaRetry: "Circle Again Into the Void",
    settingsCopy: "Arrange your meaningless preferences",
    lockedModeText: "Another barrier in the endless maze of restrictions. How fitting.",
    navAltLabel: "Navigate the absurd",
    encouragement: "Continue this futile but necessary ritual",
    modalHelper: "Persist despite the inherent meaninglessness"
  },
  romantic: {
    ctaRetry: "Draw With Love Again",
    settingsCopy: "Arrange your heart's workspace",
    lockedModeText: "This mode yearns for your touch, but first you must court the basics.",
    navAltLabel: "Love guides you",
    encouragement: "Pour your heart into another circle",
    modalHelper: "Let passion guide your practice"
  },
  philosophical: {
    ctaRetry: "Contemplate Another Circle",
    settingsCopy: "Arrange your contemplative space",
    lockedModeText: "Consider: What does it mean to be 'ready' for this mode?",
    navAltLabel: "Wisdom through circles",
    encouragement: "Reflect deeply, then draw again",
    modalHelper: "What truths will this circle reveal?"
  },
  darkHumor: {
    ctaRetry: "Fail Again Spectacularly",
    settingsCopy: "Customize your chamber of disappointment",
    lockedModeText: "Congratulations, you've found another way to be denied access.",
    navAltLabel: "Embrace the darkness",
    encouragement: "Time to disappoint yourself anew",
    modalHelper: "Ready for another dose of reality?"
  }
};

export const getTonePersonality = (tone: ToneType): TonePersonality => {
  return TONE_PERSONALITIES[tone] || TONE_PERSONALITIES.playful;
};
