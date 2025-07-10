
interface Circle {
  x: number;
  y: number;
  radius: number;
}

// Generate a random position for a circle within the screen bounds
export const generateRandomCirclePosition = (padding: number = 100): Circle => {
  // Account for the bottom navigation (70px) and ad banner space
  const availableHeight = window.innerHeight - 140; // 70px nav + 70px buffer for ads
  const availableWidth = window.innerWidth;
  
  const minRadius = Math.min(availableWidth, availableHeight) * 0.15;
  const maxRadius = Math.min(availableWidth, availableHeight) * 0.25;
  
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  
  const x = padding + radius + Math.random() * (availableWidth - 2 * (radius + padding));
  const y = padding + radius + Math.random() * (availableHeight - 2 * (radius + padding));
  
  return { x, y, radius };
};
