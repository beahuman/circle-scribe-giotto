
import { useState, useEffect } from 'react';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  thumbnail: string;
  category: string; // 'background', 'trail', or 'animation'
  value: string; // The actual value used for applying the cosmetic
}

// Default items that are always unlocked
const defaultItems: CosmeticItem[] = [
  {
    id: 'default-background',
    name: 'Default',
    description: 'Standard background theme',
    cost: 0,
    thumbnail: 'https://source.unsplash.com/random/300x200/?minimalist',
    category: 'background',
    value: 'bg-background'
  },
  {
    id: 'default-trail',
    name: 'Default',
    description: 'Standard drawing trail',
    cost: 0,
    thumbnail: 'https://source.unsplash.com/random/300x200/?line',
    category: 'trail',
    value: 'stroke-primary stroke-2'
  },
  {
    id: 'default-animation',
    name: 'Default',
    description: 'Standard score animation',
    cost: 0,
    thumbnail: 'https://source.unsplash.com/random/300x200/?animation',
    category: 'animation',
    value: 'animate-pulse'
  }
];

// Premium items that need to be unlocked
const premiumItems: CosmeticItem[] = [
  // Background themes
  {
    id: 'pastel-background',
    name: 'Pastel',
    description: 'Soft pastel background tones',
    cost: 50,
    thumbnail: 'https://source.unsplash.com/random/300x200/?pastel',
    category: 'background',
    value: 'bg-gradient-to-br from-pink-100 to-blue-100'
  },
  {
    id: 'charcoal-background',
    name: 'Charcoal',
    description: 'Dark, sophisticated background',
    cost: 75,
    thumbnail: 'https://source.unsplash.com/random/300x200/?dark',
    category: 'background',
    value: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
  },
  {
    id: 'paper-background',
    name: 'Paper',
    description: 'Textured paper background',
    cost: 100,
    thumbnail: 'https://source.unsplash.com/random/300x200/?paper',
    category: 'background',
    value: 'bg-amber-50'
  },
  
  // Drawing trail styles
  {
    id: 'neon-trail',
    name: 'Neon',
    description: 'Bright neon drawing trail',
    cost: 125,
    thumbnail: 'https://source.unsplash.com/random/300x200/?neon',
    category: 'trail',
    value: 'stroke-[#0ff] stroke-[3px] filter drop-shadow-md'
  },
  {
    id: 'ink-trail',
    name: 'Ink',
    description: 'Flowing ink drawing style',
    cost: 150,
    thumbnail: 'https://source.unsplash.com/random/300x200/?ink',
    category: 'trail',
    value: 'stroke-indigo-900 stroke-[4px]'
  },
  {
    id: 'chalk-trail',
    name: 'Chalk',
    description: 'Textured chalk drawing style',
    cost: 175,
    thumbnail: 'https://source.unsplash.com/random/300x200/?chalk',
    category: 'trail',
    value: 'stroke-white stroke-[3px] opacity-90'
  },
  
  // Score animations
  {
    id: 'sparkles-animation',
    name: 'Sparkles',
    description: 'Sparkle effects for high scores',
    cost: 200,
    thumbnail: 'https://source.unsplash.com/random/300x200/?sparkle',
    category: 'animation',
    value: 'animate-pulse-slow animate-bounce'
  },
  {
    id: 'geometric-animation',
    name: 'Geometric',
    description: 'Clean geometric animations',
    cost: 225,
    thumbnail: 'https://source.unsplash.com/random/300x200/?geometric',
    category: 'animation',
    value: 'animate-spin-slow'
  },
  {
    id: 'wave-animation',
    name: 'Wave',
    description: 'Flowing wave animations',
    cost: 250,
    thumbnail: 'https://source.unsplash.com/random/300x200/?wave',
    category: 'animation',
    value: 'animate-bounce-slow'
  }
];

export const useCosmetics = () => {
  // All available items
  const allItems = [...defaultItems, ...premiumItems];
  
  // State for unlocked items
  const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('unlockedCosmetics');
    // Default items are always unlocked
    const defaultIds = defaultItems.map(item => item.id);
    if (saved) {
      return [...defaultIds, ...JSON.parse(saved)];
    }
    return defaultIds;
  });
  
  // State for equipped items
  const [equippedItems, setEquippedItems] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('equippedCosmetics');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default equipped items (one for each category)
    return {
      background: 'default-background',
      trail: 'default-trail',
      animation: 'default-animation'
    };
  });
  
  // Save to localStorage when unlocked items change
  useEffect(() => {
    // Filter out default items when saving
    const defaultIds = defaultItems.map(item => item.id);
    const premium = unlockedItems.filter(id => !defaultIds.includes(id));
    localStorage.setItem('unlockedCosmetics', JSON.stringify(premium));
  }, [unlockedItems]);
  
  // Save to localStorage when equipped items change
  useEffect(() => {
    localStorage.setItem('equippedCosmetics', JSON.stringify(equippedItems));
  }, [equippedItems]);
  
  // Unlock a new item
  const unlockItem = (itemId: string) => {
    if (!unlockedItems.includes(itemId)) {
      setUnlockedItems(prev => [...prev, itemId]);
    }
  };
  
  // Equip an item
  const equipItem = (itemId: string) => {
    const item = allItems.find(i => i.id === itemId);
    if (item && unlockedItems.includes(itemId)) {
      setEquippedItems(prev => ({
        ...prev,
        [item.category]: itemId
      }));
    }
  };
  
  // Get the currently equipped item value for a category
  const getEquippedValue = (category: string): string => {
    const equippedId = equippedItems[category];
    const item = allItems.find(i => i.id === equippedId);
    return item ? item.value : '';
  };
  
  return {
    items: allItems,
    unlockedItems,
    equippedItems,
    unlockItem,
    equipItem,
    getEquippedValue
  };
};
