
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, CircleDot, Apple, Facebook, Google } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
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
  }

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
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CircleDot className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to continue your perfect circle journey</p>
        </div>
        
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials below</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                <Google className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('apple')}
              >
                <Apple className="mr-2 h-4 w-4" />
                Continue with Apple
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Continue with Facebook
              </Button>
            </div>

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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 p-6"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Button>
              </form>
            </Form>
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
