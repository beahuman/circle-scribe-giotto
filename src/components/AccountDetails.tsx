
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleUser } from 'lucide-react';

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
  const formattedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Card className="border-primary/20 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
        <CardTitle className="flex items-center gap-2">
          <CircleUser size={18} className="text-primary" />
          Profile Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
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
      </CardContent>
    </Card>
  );
};

export default AccountDetails;
