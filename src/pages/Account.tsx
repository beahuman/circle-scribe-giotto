
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, CircleUser, LogOut, Trash2 } from 'lucide-react';
import AccountDetails from '@/components/AccountDetails';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Mock user data - would come from authentication service in real app
  const userData = {
    username: 'GiottoMaster',
    email: 'artist@example.com',
    createdAt: '2023-10-15',
    totalGames: 42,
    bestScore: 92.7,
    avatarColor: '#9b87f5'
  };
  
  const handleSignOut = () => {
    // In a real app, this would call auth service logout method
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    
    // Redirect to home after signing out
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Account</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <AccountDetails userData={userData} />
        
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" />
              Game Statistics
            </CardTitle>
            <CardDescription>Your performance so far</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/account/edit')}
            className="flex items-center justify-center gap-2 p-6 animate-pulse-slow"
          >
            <CircleUser className="h-5 w-5" />
            Edit Profile
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 p-6"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center justify-center gap-2 p-6 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-5 w-5" />
            Delete Account
          </Button>
        </div>
      </div>
      
      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
      />
    </div>
  );
};

export default Account;
