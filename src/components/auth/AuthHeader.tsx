
import React from 'react';
import LogoHeader from '../common/LogoHeader';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <LogoHeader size="medium" clickable={false} />
      </div>
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
