
import React from 'react';
import { CircleDot } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <CircleDot className="text-primary h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
