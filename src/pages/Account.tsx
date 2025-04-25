import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AccountDetails from '@/components/AccountDetails';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { Separator } from '@/components/ui/separator';

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const userData = {
    username: 'GiottoMaster',
    email: 'artist@example.com',
    createdAt: '2023-10-15',
    totalGames: 42,
    bestScore: 92.7,
    avatarColor: '#9b87f5'
  };
  
  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Account</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <AccountDetails userData={userData} />
        
        <Separator className="bg-purple-300/20" />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <i className="ri-trophy-line text-xl text-primary" />
            Game Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold">{userData.totalGames}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-bold">{userData.bestScore}%</p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-purple-300/20" />
        
        <div className="grid grid-cols-1 gap-4">
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
