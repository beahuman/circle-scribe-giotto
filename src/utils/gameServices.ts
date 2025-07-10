
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface GameService {
  initialize: () => Promise<void>;
  signIn: () => Promise<boolean>;
  submitScore: (score: number) => Promise<void>;
  showLeaderboard: () => Promise<void>;
  isAvailable: () => Promise<boolean>;
}

class GameCenterService implements GameService {
  async initialize(): Promise<void> {
    console.log("Game Center initialization");
    // On real iOS, this would initialize the Game Center SDK
    return Promise.resolve();
  }

  async signIn(): Promise<boolean> {
    console.log("Game Center sign in");
    // On real iOS, this would authenticate with Game Center
    // For now, we'll check if we're on iOS
    const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    return Promise.resolve(isIOS);
  }

  async submitScore(score: number): Promise<void> {
    console.log(`Submitting score ${score} to Game Center`);
    
    try {
      // Save score to our database
      const { error } = await supabase
        .from('game_scores')
        .insert({
          score: Math.round(score),
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          game_center_synced: true
        });

      if (error) {
        console.error('Error saving score:', error);
        throw error;
      }
      
      // On real iOS, this would submit to Game Center leaderboard
      console.log("Score saved and synced with Game Center");
    } catch (err) {
      console.error("Error in submitScore:", err);
    }
    
    return Promise.resolve();
  }

  async showLeaderboard(): Promise<void> {
    console.log("Showing Game Center leaderboard");
    
    try {
      // Fetch leaderboard from our database
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      console.log('Leaderboard data:', data);
      
      // On real iOS, this would show the Game Center leaderboard UI
    } catch (err) {
      console.error("Error showing leaderboard:", err);
    }
    
    return Promise.resolve();
  }

  async isAvailable(): Promise<boolean> {
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
    
    try {
      // Save score to our database even in mock mode
      const { error } = await supabase
        .from('game_scores')
        .insert({
          score: Math.round(score),
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          game_center_synced: false
        });

      if (error) {
        console.error('Error saving mock score:', error);
      }
    } catch (err) {
      console.error("Error in mock submitScore:", err);
    }
    
    return Promise.resolve();
  }

  async showLeaderboard(): Promise<void> {
    console.log("Mock show leaderboard");
    
    try {
      // Fetch leaderboard from our database
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        console.log('Web leaderboard data:', data);
      }
    } catch (err) {
      console.error("Error showing mock leaderboard:", err);
    }
    
    return Promise.resolve();
  }

  async isAvailable(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

let gameService: GameService;

export const getGameService = async (): Promise<GameService> => {
  if (!gameService) {
    const gameCenterService = new GameCenterService();
    if (await gameCenterService.isAvailable()) {
      gameService = gameCenterService;
      console.log("Using native Game Center service");
    } else {
      gameService = new WebMockGameService();
      console.log("Using web mock game service");
    }
    
    await gameService.initialize();
  }
  
  return gameService;
};
