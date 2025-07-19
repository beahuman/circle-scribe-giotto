import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ghost } from 'lucide-react';
import { Dialog } from '@capacitor/dialog';
import AuthHeader from '@/components/auth/AuthHeader';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailSignInForm from '@/components/auth/EmailSignInForm';
import EmailSignUpForm from '@/components/auth/EmailSignUpForm';
import LogoAnimation from '@/components/LogoAnimation';

interface ProfileUpdate {
  username: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);

  const handleEmailSignIn = async (values: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmailSignUp = async (values: { username: string; email: string; password: string }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const profileUpdate: ProfileUpdate = { username: values.username };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created",
        description: "Welcome to the perfect circle challenge!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSocialAuth = async (provider: 'apple') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGuestPlay = async () => {
    const { value } = await Dialog.confirm({
      title: 'Playing as Guest',
      message: 'Your scores and progress won\'t be saved. Create an account anytime to track your progress!',
      okButtonTitle: 'Continue',
      cancelButtonTitle: 'Cancel'
    });

    if (value) {
      localStorage.setItem('guestMode', 'true');
      navigate('/');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center p-6 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8 pt-4 pb-24">
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Welcome To
          </h1>
          <div className="flex justify-center w-full">
            <div className="w-[240px]">
              <LogoAnimation size={128} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="signin" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full mb-6">
              <TabsTrigger value="signin" className="rounded-full">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">Create Account</TabsTrigger>
            </TabsList>
            <div className="relative min-h-[300px]">
              <TabsContent value="signin" className="mt-0 transition-all duration-500 ease-in-out absolute w-full">
                <EmailSignInForm onSubmit={handleEmailSignIn} />
                <div className="space-y-4 mt-6">
                  <SocialLoginButtons onSocialLogin={handleSocialAuth} />
                  <Button 
                    variant="outline" 
                    onClick={handleGuestPlay}
                    className="w-full px-8 py-6 text-lg rounded-full border-[#9b87f5] bg-white text-[#9b87f5] hover:bg-[#9b87f5]/5"
                  >
                    <Ghost className="mr-2 h-5 w-5 text-[#9b87f5]" />
                    Play as Guest
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="signup" className="mt-0 transition-all duration-500 ease-in-out absolute w-full">
                <EmailSignUpForm onSubmit={handleEmailSignUp} />
                <div className="space-y-4 mt-6">
                  <SocialLoginButtons onSocialLogin={handleSocialAuth} />
                  <Button 
                    variant="outline" 
                    onClick={handleGuestPlay}
                    className="w-full px-8 py-6 text-lg rounded-full border-[#9b87f5] bg-white text-[#9b87f5] hover:bg-[#9b87f5]/5"
                  >
                    <Ghost className="mr-2 h-5 w-5 text-[#9b87f5]" />
                    Play as Guest
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
