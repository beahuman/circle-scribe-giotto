
import React from 'react';
import { CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AccountDetailsProps {
  userId: string;
}

const AccountDetails = ({ userId }: AccountDetailsProps) => {
  const navigate = useNavigate();
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;

      const { data: scores, error: scoresError } = await supabase
        .from('game_scores')
        .select('score')
        .eq('user_id', userId)
        .order('score', { ascending: false });

      if (scoresError) throw scoresError;

      return {
        ...profile,
        bestScore: scores?.[0]?.score || 0,
        totalGames: scores?.length || 0
      };
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <CircleUser size={18} className="text-primary" />
          Profile Details
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
              style={{ 
                backgroundColor: userData?.avatar_image ? 'transparent' : userData?.avatar_color || '#9b87f5'
              }}
            >
              {userData?.avatar_image ? (
                <img 
                  src={userData.avatar_image} 
                  alt={`${userData.username}'s avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                userData?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{userData?.username}</h3>
              <p className="text-sm text-muted-foreground">{userData?.email}</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Member since {new Date(userData?.created_at).toLocaleDateString()}
          </div>

          <Button 
            variant="outline" 
            onClick={() => navigate('/account/edit')}
            className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-2"
          >
            <i className="ri-user-settings-line text-2xl text-primary animate-pulse" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
