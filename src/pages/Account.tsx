
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Settings } from 'lucide-react';
import AccountDetails from '@/components/AccountDetails';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GameStats {
  totalGames: number;
  bestScore: number;
}

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();
  
  const { data: gameStats, isLoading } = useQuery<GameStats>({
    queryKey: ['gameStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalGames: 0, bestScore: 0 };
      
      const { data, error } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', user.id)
        .order('score', { ascending: false });
        
      if (error) throw error;
      
      return {
        totalGames: data?.length || 0,
        bestScore: data && data.length > 0 ? data[0].score : 0
      };
    },
    enabled: !!user
  });
  
  const handleSignOut = () => {
    supabase.auth.signOut().then(() => {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      setTimeout(() => navigate('/'), 1000);
    });
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Account</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {user?.id && <AccountDetails userId={user.id} />}
        
        <Separator className="bg-purple-300/20" />
        
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Trophy size={18} className="text-primary" />
            Game Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : gameStats?.totalGames}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : `${gameStats?.bestScore}%`}</p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-purple-300/20" />
        
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
            className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-2"
          >
            <Settings className="h-6 w-6 text-primary" />
            App Settings
          </Button>

          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-2"
          >
            <i className="ri-logout-box-line text-2xl text-primary" />
            Sign Out
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(true)}
            className="w-full px-8 py-6 text-lg rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2"
          >
            <i className="ri-delete-bin-line text-2xl" />
            Delete Account
          </Button>
        </div>
      </div>
      
      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />
      
      <BottomNav />
    </div>
  );
};

export default Account;
