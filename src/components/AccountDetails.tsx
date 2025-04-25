
import React from 'react';
import { CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface UserData {
  username: string;
  email: string;
  createdAt: string;
  avatarColor: string;
  totalGames: number;
  bestScore: number;
}

interface AccountDetailsProps {
  userData: UserData;
}

const AccountDetails = ({ userData }: AccountDetailsProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
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
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: userData.avatarColor }}
            >
              {userData.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{userData.username}</h3>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Member since {formattedDate}
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
