
import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: 'apple') => Promise<void>;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onSocialLogin }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Button 
        variant="outline" 
        className="w-full px-8 py-6 text-lg rounded-lg border-primary bg-card text-primary hover:bg-primary/5"
        onClick={() => onSocialLogin('apple')}
      >
        <i className="ri-apple-fill text-2xl mr-2 text-primary" />
        Continue with Apple
      </Button>
    </div>
  );
};

export default SocialLoginButtons;

