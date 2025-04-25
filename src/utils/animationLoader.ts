
export const preloadAnimation = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error preloading animation:', error);
    throw error;
  }
};
