import { ToneType } from '@/utils/toneMessages';

export interface ToneColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export const useToneColorSystem = () => {
  const getToneColorScheme = (tone: ToneType): ToneColorScheme => {
    const schemes: Record<ToneType, ToneColorScheme> = {
      playful: {
        primary: 'tone-playful-primary',
        secondary: 'tone-playful-secondary',
        accent: 'tone-playful-accent',
        background: 'tone-playful-background',
        surface: 'tone-playful-surface',
        text: 'tone-playful-text',
        textMuted: 'tone-playful-text-muted'
      },
      calm: {
        primary: 'tone-meditative-primary',
        secondary: 'tone-meditative-secondary',
        accent: 'tone-meditative-accent',
        background: 'tone-meditative-background',
        surface: 'tone-meditative-surface',
        text: 'tone-meditative-text',
        textMuted: 'tone-meditative-text-muted'
      },
      formal: {
        primary: 'tone-formal-primary',
        secondary: 'tone-formal-secondary',
        accent: 'tone-formal-accent',
        background: 'tone-formal-background',
        surface: 'tone-formal-surface',
        text: 'tone-formal-text',
        textMuted: 'tone-formal-text-muted'
      },
      sarcastic: {
        primary: 'tone-sarcastic-primary',
        secondary: 'tone-sarcastic-secondary',
        accent: 'tone-sarcastic-accent',
        background: 'tone-sarcastic-background',
        surface: 'tone-sarcastic-surface',
        text: 'tone-sarcastic-text',
        textMuted: 'tone-sarcastic-text-muted'
      },
      // Variant tones inherit from base tones
      romantic: {
        primary: 'tone-playful-primary',
        secondary: 'tone-playful-secondary',
        accent: 'tone-playful-accent',
        background: 'tone-playful-background',
        surface: 'tone-playful-surface',
        text: 'tone-playful-text',
        textMuted: 'tone-playful-text-muted'
      },
      poetic: {
        primary: 'tone-meditative-primary',
        secondary: 'tone-meditative-secondary',
        accent: 'tone-meditative-accent',
        background: 'tone-meditative-background',
        surface: 'tone-meditative-surface',
        text: 'tone-meditative-text',
        textMuted: 'tone-meditative-text-muted'
      },
      philosophical: {
        primary: 'tone-formal-primary',
        secondary: 'tone-formal-secondary',
        accent: 'tone-formal-accent',
        background: 'tone-formal-background',
        surface: 'tone-formal-surface',
        text: 'tone-formal-text',
        textMuted: 'tone-formal-text-muted'
      },
      darkHumor: {
        primary: 'tone-sarcastic-primary',
        secondary: 'tone-sarcastic-secondary',
        accent: 'tone-sarcastic-accent',
        background: 'tone-sarcastic-background',
        surface: 'tone-sarcastic-surface',
        text: 'tone-sarcastic-text',
        textMuted: 'tone-sarcastic-text-muted'
      },
      existential: {
        primary: 'tone-meditative-primary',
        secondary: 'tone-meditative-secondary',
        accent: 'tone-meditative-accent',
        background: 'tone-meditative-background',
        surface: 'tone-meditative-surface',
        text: 'tone-meditative-text',
        textMuted: 'tone-meditative-text-muted'
      }
    };

    return schemes[tone];
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 50) return 'score-fair';
    return 'score-poor';
  };

  const getFeedbackStateColor = (state: 'success' | 'warning' | 'error' | 'info'): string => {
    const stateColors = {
      success: 'success',
      warning: 'warning',
      error: 'error',
      info: 'info'
    };
    return stateColors[state];
  };

  const getToneBackgroundClasses = (tone: ToneType): string => {
    const scheme = getToneColorScheme(tone);
    return `bg-${scheme.background}`;
  };

  const getToneTextClasses = (tone: ToneType, variant: 'primary' | 'muted' = 'primary'): string => {
    const scheme = getToneColorScheme(tone);
    return variant === 'primary' ? `text-${scheme.text}` : `text-${scheme.textMuted}`;
  };

  const getToneAccentClasses = (tone: ToneType): string => {
    const scheme = getToneColorScheme(tone);
    return `text-${scheme.accent}`;
  };

  const getToneSurfaceClasses = (tone: ToneType): string => {
    const scheme = getToneColorScheme(tone);
    return `bg-${scheme.surface}`;
  };

  const getTonePrimaryClasses = (tone: ToneType): string => {
    const scheme = getToneColorScheme(tone);
    return `bg-${scheme.primary} text-white`;
  };

  const applyToneToElement = (element: HTMLElement, tone: ToneType) => {
    const scheme = getToneColorScheme(tone);
    element.style.setProperty('--tone-primary', `hsl(var(--${scheme.primary}))`);
    element.style.setProperty('--tone-background', `hsl(var(--${scheme.background}))`);
    element.style.setProperty('--tone-surface', `hsl(var(--${scheme.surface}))`);
    element.style.setProperty('--tone-text', `hsl(var(--${scheme.text}))`);
    element.style.setProperty('--tone-accent', `hsl(var(--${scheme.accent}))`);
  };

  return {
    getToneColorScheme,
    getScoreColor,
    getFeedbackStateColor,
    getToneBackgroundClasses,
    getToneTextClasses,
    getToneAccentClasses,
    getToneSurfaceClasses,
    getTonePrimaryClasses,
    applyToneToElement
  };
};