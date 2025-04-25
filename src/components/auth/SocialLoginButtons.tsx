
import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onSocialLogin }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onSocialLogin('google')}
      >
        <i className="ri-mail-line text-lg mr-2 text-primary" />
        Continue with Google
      </Button>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onSocialLogin('apple')}
      >
        <i className="ri-apple-line text-lg mr-2 text-primary" />
        Continue with Apple
      </Button>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onSocialLogin('facebook')}
      >
        <i className="ri-facebook-circle-line text-lg mr-2 text-primary" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
