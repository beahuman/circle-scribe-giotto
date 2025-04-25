
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CircleUser, Save } from 'lucide-react';
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

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const EditAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data - would come from authentication service in real app
  const userData = {
    username: 'GiottoMaster',
    email: 'artist@example.com',
    avatarColor: '#9b87f5'
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userData.username,
      email: userData.email,
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would call auth service to update the account
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    
    // Navigate back to account page
    setTimeout(() => navigate('/account'), 1000);
  }
  
  const avatarColors = [
    '#9b87f5', '#F97316', '#33C3F0', '#8B5CF6', '#D3E4FD', '#FFDEE2'
  ];
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/account')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Edit Profile</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <CircleUser size={18} className="text-primary" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center mb-8">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: userData.avatarColor }}
                  >
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                  {avatarColors.map((color) => (
                    <div 
                      key={color} 
                      className="w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 p-6"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAccount;
