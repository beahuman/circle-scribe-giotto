import { useMemo } from 'react';
import { MonetizationItem } from './useMonetization';

// Enhanced store items with monetization options
export const useStoreItems = () => {
  const storeItems: MonetizationItem[] = useMemo(() => [
    // Default items (always free)
    {
      id: 'default-background',
      name: 'Default',
      description: 'Standard background theme',
      cost: 0,
      isPremium: false,
      isBundle: false,
      category: 'background',
      thumbnail: 'https://source.unsplash.com/random/300x200/?minimalist',
      value: 'bg-background'
    },
    {
      id: 'default-trail',
      name: 'Default',
      description: 'Standard drawing trail',
      cost: 0,
      isPremium: false,
      isBundle: false,
      category: 'trail',
      thumbnail: 'https://source.unsplash.com/random/300x200/?line',
      value: 'stroke-primary stroke-2'
    },
    {
      id: 'default-animation',
      name: 'Default',
      description: 'Standard score animation',
      cost: 0,
      isPremium: false,
      isBundle: false,
      category: 'animation',
      thumbnail: 'https://source.unsplash.com/random/300x200/?animation',
      value: 'animate-pulse'
    },

    // Background Themes
    {
      id: 'ink-wash-theme',
      name: 'Ink Wash',
      description: 'Traditional sumi-e inspired background',
      cost: 150,
      price: 199,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'background',
      thumbnail: 'https://source.unsplash.com/random/300x200/?ink+wash',
      value: 'bg-gradient-to-br from-slate-100 to-slate-200',
      previewAnimation: 'ink-flow'
    },
    {
      id: 'lunar-fade-theme',
      name: 'Lunar Fade',
      description: 'Soft moonlight ambiance',
      cost: 200,
      price: 249,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'background',
      thumbnail: 'https://source.unsplash.com/random/300x200/?moon+fade',
      value: 'bg-gradient-to-br from-blue-900 to-indigo-900',
      previewAnimation: 'lunar-glow'
    },
    {
      id: 'neurogrid-theme',
      name: 'Neurogrid',
      description: 'Neural network inspired pattern',
      cost: 300,
      price: 349,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'background',
      thumbnail: 'https://source.unsplash.com/random/300x200/?neural+network',
      value: 'bg-slate-900 neuro-grid-pattern',
      previewAnimation: 'neuron-pulse'
    },

    // Brush Styles
    {
      id: 'glowline-brush',
      name: 'Glowline',
      description: 'Luminescent drawing trail',
      cost: 175,
      price: 199,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'trail',
      thumbnail: 'https://source.unsplash.com/random/300x200/?glow+line',
      value: 'stroke-cyan-400 stroke-[3px] filter drop-shadow-lg glow-effect',
      previewAnimation: 'glow-trace'
    },
    {
      id: 'laser-trace-brush',
      name: 'Laser Trace',
      description: 'Precise laser-like strokes',
      cost: 250,
      price: 299,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'trail',
      thumbnail: 'https://source.unsplash.com/random/300x200/?laser',
      value: 'stroke-red-400 stroke-[2px] filter drop-shadow-md laser-effect',
      previewAnimation: 'laser-sweep'
    },
    {
      id: 'graphite-scratch-brush',
      name: 'Graphite Scratch',
      description: 'Traditional pencil texture',
      cost: 125,
      price: 149,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'trail',
      thumbnail: 'https://source.unsplash.com/random/300x200/?graphite+pencil',
      value: 'stroke-gray-800 stroke-[4px] opacity-80 graphite-texture',
      previewAnimation: 'pencil-sketch'
    },

    // Tone Variants
    {
      id: 'sarcastic-pack-2',
      name: 'Sarcastic Pack Vol. 2',
      description: 'Deeper roasts and witty remarks',
      cost: 300,
      price: 399,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'tone',
      thumbnail: 'https://source.unsplash.com/random/300x200/?sarcasm',
      value: 'sarcastic-extended',
      previewAnimation: 'text-reveal'
    },
    {
      id: 'poetic-extended',
      name: 'Poetic Extended',
      description: '30 haiku-style affirmations',
      cost: 250,
      price: 299,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'tone',
      thumbnail: 'https://source.unsplash.com/random/300x200/?haiku+poetry',
      value: 'poetic-haiku',
      previewAnimation: 'verse-flow'
    },

    // Ambient Soundscapes
    {
      id: 'temple-wind-ambient',
      name: 'Temple Wind',
      description: 'Calming temple atmosphere',
      cost: 200,
      price: 199,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'ambient',
      thumbnail: 'https://source.unsplash.com/random/300x200/?temple+wind',
      value: 'temple-wind-audio',
      previewAnimation: 'sound-wave'
    },
    {
      id: 'studio-reverb-ambient',
      name: 'Studio Reverb',
      description: 'Professional studio ambiance',
      cost: 175,
      price: 149,
      currency: 'USD',
      isPremium: false,
      isBundle: false,
      category: 'ambient',
      thumbnail: 'https://source.unsplash.com/random/300x200/?recording+studio',
      value: 'studio-reverb-audio',
      previewAnimation: 'reverb-wave'
    },

    // Premium Bundles
    {
      id: 'spiral-master-bundle',
      name: 'Spiral Master Bundle',
      description: 'Complete spiral-themed experience',
      cost: 0,
      price: 799,
      currency: 'USD',
      isPremium: true,
      isBundle: true,
      category: 'bundle',
      thumbnail: 'https://source.unsplash.com/random/300x200/?spiral+pattern',
      value: 'spiral-master-bundle',
      previewAnimation: 'spiral-reveal'
    },

    // Supporter Tier
    {
      id: 'supporter-tier',
      name: 'Studio Patron',
      description: 'Support neural creativity development',
      cost: 0,
      price: 499,
      currency: 'USD',
      isPremium: true,
      isBundle: false,
      category: 'supporter',
      thumbnail: 'https://source.unsplash.com/random/300x200/?golden+brush',
      value: 'supporter-tier',
      previewAnimation: 'golden-glow'
    }
  ], []);

  const getItemsByCategory = (category: string) => {
    return storeItems.filter(item => item.category === category);
  };

  const getItemById = (id: string) => {
    return storeItems.find(item => item.id === id);
  };

  const getBundles = () => {
    return storeItems.filter(item => item.isBundle);
  };

  const getPremiumItems = () => {
    return storeItems.filter(item => item.isPremium);
  };

  const getFreeItems = () => {
    return storeItems.filter(item => !item.isPremium && item.cost > 0);
  };

  return {
    storeItems,
    getItemsByCategory,
    getItemById,
    getBundles,
    getPremiumItems,
    getFreeItems
  };
};