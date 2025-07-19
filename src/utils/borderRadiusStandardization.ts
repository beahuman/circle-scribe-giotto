// Border Radius Standardization Utility
// This utility maps existing radius values to standardized tokens

export const RADIUS_MAPPINGS = {
  // Buttons and interactive elements
  'rounded-xl': 'rounded-xl',    // Card corners, large containers
  'rounded-lg': 'rounded-lg',    // Medium sized elements
  'rounded-md': 'rounded-md',    // Default components, buttons
  'rounded-sm': 'rounded-sm',    // Micro elements
  'rounded-full': 'rounded-full', // Circular elements (keep as-is)
  
  // Non-standard radius values to be standardized
  'rounded-[6px]': 'rounded-sm',
  'rounded-[10px]': 'rounded-md',
  'rounded-[12px]': 'rounded-md',
  'rounded-[14px]': 'rounded-lg',
  'rounded-[16px]': 'rounded-lg',
  'rounded-[18px]': 'rounded-xl',
  'rounded-[20px]': 'rounded-xl',
  'rounded-[24px]': 'rounded-xl',
} as const;

// Component-specific radius guidelines
export const COMPONENT_RADIUS_GUIDELINES = {
  buttons: 'rounded-md',        // All buttons use medium radius
  cards: 'rounded-xl',          // Cards and panels use extra large radius
  modals: 'rounded-xl',         // Modals use extra large radius
  inputs: 'rounded-md',         // Form inputs use medium radius
  badges: 'rounded-full',       // Badges and pills use full radius
  tooltips: 'rounded-md',       // Tooltips use medium radius
  notifications: 'rounded-lg',  // Notifications use large radius
  avatars: 'rounded-full',      // Avatars always circular
  icons: 'rounded-full',        // Icon containers use full radius
  toggles: 'rounded-full',      // Toggle switches use full radius
} as const;

export type ComponentType = keyof typeof COMPONENT_RADIUS_GUIDELINES;
export type RadiusToken = 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';

export function getStandardRadius(componentType: ComponentType): RadiusToken {
  return COMPONENT_RADIUS_GUIDELINES[componentType] as RadiusToken;
}

export function standardizeRadius(currentRadius: string): RadiusToken {
  return (RADIUS_MAPPINGS[currentRadius as keyof typeof RADIUS_MAPPINGS] || 'rounded-md') as RadiusToken;
}