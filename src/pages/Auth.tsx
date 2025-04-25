import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ghost } from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailSignInForm from '@/components/auth/EmailSignInForm';
import EmailSignUpForm from '@/components/auth/EmailSignUpForm';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: values.username })
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

  const handleGuestPlay = () => {
    localStorage.setItem('guestMode', 'true');
    toast({
      title: "Playing as Guest",
      description: "Your scores and progress won't be saved. Create an account anytime to track your progress!",
      variant: "default",
      duration: 5000,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader 
          title="Welcome to Giotto"
          subtitle="Sign in or create an account to continue"
        />
        
        <div className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="signin" className="rounded-full">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <EmailSignInForm onSubmit={handleEmailSignIn} />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <EmailSignUpForm onSubmit={handleEmailSignUp} />
            </TabsContent>
          </Tabs>

          <SocialLoginButtons onSocialLogin={handleSocialAuth} />

          <Button 
            variant="outline" 
            onClick={handleGuestPlay}
            className="w-full px-8 py-6 text-lg rounded-full border-[#7E69AB] hover:bg-primary/5 text-[#9b87f5]"
          >
            <Ghost className="mr-2 h-5 w-5" />
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
