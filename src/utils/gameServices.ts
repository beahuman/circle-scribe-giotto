
interface GameService {
  initialize: () => Promise<void>;
  signIn: () => Promise<boolean>;
  submitScore: (score: number) => Promise<void>;
  showLeaderboard: () => Promise<void>;
  isAvailable: () => Promise<boolean>;
}

class GameCenterService implements GameService {
  async initialize(): Promise<void> {
    // Game Center initialization would go here
    console.log("Game Center initialization");
    return Promise.resolve();
  }

  async signIn(): Promise<boolean> {
    // Game Center authentication would go here
    console.log("Game Center sign in");
    return Promise.resolve(true);
  }

  async submitScore(score: number): Promise<void> {
    // Submit score to Game Center
    console.log(`Submitting score ${score} to Game Center`);
    return Promise.resolve();
  }

  async showLeaderboard(): Promise<void> {
    // Show Game Center leaderboard
    console.log("Showing Game Center leaderboard");
    return Promise.resolve();
  }

  async isAvailable(): Promise<boolean> {
    // Check if Game Center is available on iOS
    const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    return Promise.resolve(isIOS);
  }
}

class WebMockGameService implements GameService {
  async initialize(): Promise<void> {
    console.log("Mock game service initialized");
    return Promise.resolve();
  }

  async signIn(): Promise<boolean> {
    console.log("Mock sign in - always succeeds");
    return Promise.resolve(true);
  }

  async submitScore(score: number): Promise<void> {
    console.log(`Mock submit score: ${score}`);
    return Promise.resolve();
  }

  async showLeaderboard(): Promise<void> {
    console.log("Mock show leaderboard");
    return Promise.resolve();
  }

  async isAvailable(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

// Export a singleton instance of the appropriate service
let gameService: GameService;

export const getGameService = async (): Promise<GameService> => {
  if (!gameService) {
    // Try Game Center for iOS
    const gameCenterService = new GameCenterService();
    if (await gameCenterService.isAvailable()) {
      gameService = gameCenterService;
    } else {
      // Fall back to mock service for web
      gameService = new WebMockGameService();
    }
    
    // Initialize the selected service
    await gameService.initialize();
  }
  
  return gameService;
};
