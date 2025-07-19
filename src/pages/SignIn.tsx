
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthHeader from '@/components/auth/AuthHeader';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import EmailSignInForm from '@/components/auth/EmailSignInForm';

const SignIn = () => {
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

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
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
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader 
          title="Welcome Back"
          subtitle="Sign in to continue your perfect circle journey"
        />
        
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials below</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <SocialLoginButtons onSocialLogin={handleSocialLogin} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <EmailSignInForm onSubmit={handleEmailSignIn} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-muted/20 p-6">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account yet?
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/signup')}
            >
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
