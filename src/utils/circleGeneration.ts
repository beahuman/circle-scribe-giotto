interface Circle {
  x: number;
  y: number;
  radius: number;
}

// Generate a random position for a circle within the screen bounds
export const generateRandomCirclePosition = (padding: number = 100): Circle => {
  // Account for the bottom navigation (70px total)
  const availableHeight = window.innerHeight - 70;
  const availableWidth = window.innerWidth;
  
  const minRadius = Math.min(availableWidth, availableHeight) * 0.15;
  const maxRadius = Math.min(availableWidth, availableHeight) * 0.25;
  
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  
  // Generate coordinates within the available space, accounting for bottom nav
  const x = padding + radius + Math.random() * (availableWidth - 2 * (radius + padding));
  const y = padding + radius + Math.random() * (availableHeight - 2 * (radius + padding));
  
  return { x, y, radius };
};

// Generate an offset circle position (20-30% screen shift from center)
export const generateOffsetCirclePosition = (padding: number = 100, mirrorMode: boolean = false): Circle => {
  const availableHeight = window.innerHeight - 70;
  const availableWidth = window.innerWidth;
  
  const minRadius = Math.min(availableWidth, availableHeight) * 0.15;
  const maxRadius = Math.min(availableWidth, availableHeight) * 0.25;
  
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  
  // Calculate center point
  const centerX = availableWidth / 2;
  const centerY = availableHeight / 2;
  
  // Generate offset distance (20-30% of screen)
  const offsetDistance = Math.min(availableWidth, availableHeight) * (0.2 + Math.random() * 0.1);
  
  // Random angle for offset direction
  const angle = Math.random() * Math.PI * 2;
  
  // Calculate offset position
  let offsetX = centerX + Math.cos(angle) * offsetDistance;
  let offsetY = centerY + Math.sin(angle) * offsetDistance;
  
  // Apply mirror flip if enabled
  if (mirrorMode) {
    offsetX = availableWidth - offsetX;
  }
  
  // Ensure the circle stays within bounds
  offsetX = Math.max(padding + radius, Math.min(availableWidth - padding - radius, offsetX));
  offsetY = Math.max(padding + radius, Math.min(availableHeight - padding - radius, offsetY));
  
  return { x: offsetX, y: offsetY, radius };
};