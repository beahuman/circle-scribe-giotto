import { useState, useEffect, useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useToneSystem } from './useToneSystem';

export type FeedbackEvent = 'draw-start' | 'draw-end' | 'score-reveal' | 'mode-unlock' | 'high-score' | 'streak-break';

interface SensorySettings {
  hapticsEnabled: boolean;
  audioEnabled: boolean;
  voiceoverEnabled: boolean; // Future feature
}

interface AudioSettings {
  context: AudioContext | null;
  gainNode: GainNode | null;
}

const HAPTIC_PATTERNS = {
  'draw-start': ImpactStyle.Light,
  'draw-end': ImpactStyle.Light,
  'score-reveal': ImpactStyle.Medium,
  'mode-unlock': ImpactStyle.Heavy,
  'high-score': ImpactStyle.Medium,
  'streak-break': ImpactStyle.Light,
} as const;

export const useSensoryFeedback = () => {
  const { selectedTone } = useToneSystem();
  const [settings, setSettings] = useState<SensorySettings>(() => {
    const saved = localStorage.getItem('sensoryFeedbackSettings');
    return saved ? JSON.parse(saved) : {
      hapticsEnabled: false,
      audioEnabled: false,
      voiceoverEnabled: false,
    };
  });

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    context: null,
    gainNode: null,
  });

  // Initialize audio context
  useEffect(() => {
    if (settings.audioEnabled && !audioSettings.context) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0.3, context.currentTime); // Subtle volume
        
        setAudioSettings({ context, gainNode });
      } catch (error) {
        console.warn('Audio context not available:', error);
      }
    }
  }, [settings.audioEnabled, audioSettings.context]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('sensoryFeedbackSettings', JSON.stringify(settings));
  }, [settings]);

  // Create tone-aware audio cue
  const createAudioCue = useCallback((event: FeedbackEvent) => {
    if (!settings.audioEnabled || !audioSettings.context || !audioSettings.gainNode) return;

    const { context, gainNode } = audioSettings;
    
    try {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNode);
      
      // Base frequencies and patterns based on event
      let frequency = 440;
      let duration = 0.1;
      let type: OscillatorType = 'sine';
      
      switch (event) {
        case 'draw-start':
          frequency = 523; // C5
          duration = 0.05;
          type = 'sine';
          break;
        case 'draw-end':
          frequency = 392; // G4
          duration = 0.08;
          type = 'sine';
          break;
        case 'score-reveal':
          frequency = 659; // E5
          duration = 0.3;
          type = 'triangle';
          break;
        case 'mode-unlock':
          frequency = 880; // A5
          duration = 0.5;
          type = 'triangle';
          break;
        case 'high-score':
          frequency = 784; // G5
          duration = 0.2;
          type = 'square';
          break;
        case 'streak-break':
          frequency = 293; // D4
          duration = 0.15;
          type = 'sawtooth';
          break;
      }
      
      // Adjust for tone personality
      switch (selectedTone) {
        case 'playful':
          frequency *= 1.2; // Higher pitch
          type = 'square';
          break;
        case 'calm':
          frequency *= 0.8; // Lower pitch
          duration *= 1.5; // Longer
          type = 'sine';
          break;
        case 'formal':
          // Keep defaults - precise and clean
          type = 'triangle';
          break;
        case 'sarcastic':
          frequency *= 0.9; // Slightly flat
          type = 'sawtooth';
          duration *= 0.7; // Shorter, dry
          break;
      }
      
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.type = type;
      
      // Envelope for smooth attack/release
      envelope.gain.setValueAtTime(0, context.currentTime);
      envelope.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
      
      // Clean up
      setTimeout(() => {
        try {
          oscillator.disconnect();
          envelope.disconnect();
        } catch (e) {
          // Already disconnected
        }
      }, duration * 1000 + 100);
      
    } catch (error) {
      console.warn('Error creating audio cue:', error);
    }
  }, [settings.audioEnabled, audioSettings, selectedTone]);

  // Trigger haptic feedback
  const triggerHaptic = useCallback(async (event: FeedbackEvent) => {
    if (!settings.hapticsEnabled || !Capacitor.isNativePlatform()) return;
    
    try {
      const impact = HAPTIC_PATTERNS[event];
      await Haptics.impact({ style: impact });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }, [settings.hapticsEnabled]);

  // Main feedback trigger
  const triggerFeedback = useCallback((event: FeedbackEvent) => {
    triggerHaptic(event);
    createAudioCue(event);
  }, [triggerHaptic, createAudioCue]);

  // Settings updaters
  const updateSettings = useCallback((newSettings: Partial<SensorySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleHaptics = useCallback(() => {
    setSettings(prev => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }));
  }, []);

  const toggleAudio = useCallback(() => {
    setSettings(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  }, []);

  const toggleVoiceover = useCallback(() => {
    setSettings(prev => ({ ...prev, voiceoverEnabled: !prev.voiceoverEnabled }));
  }, []);

  // Test feedback for settings
  const testFeedback = useCallback(() => {
    triggerFeedback('score-reveal');
  }, [triggerFeedback]);

  return {
    settings,
    triggerFeedback,
    updateSettings,
    toggleHaptics,
    toggleAudio,
    toggleVoiceover,
    testFeedback,
    isNativePlatform: Capacitor.isNativePlatform(),
  };
};
