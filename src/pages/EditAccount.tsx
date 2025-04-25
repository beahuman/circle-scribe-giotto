
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
import BottomNav from '@/components/BottomNav';
import { useAvatarEditor } from '@/hooks/useAvatarEditor';
import { AvatarEditor } from '@/components/profile/AvatarEditor';

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
  
  // Get data from localStorage if available, otherwise use default values
  const storedUserData = localStorage.getItem('userData');
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {
    username: 'GiottoMaster',
    email: 'artist@example.com',
    avatarColor: '#9b87f5',
    avatarImage: null
  };
  
  const {
    selectedColor,
    avatarPreview,
    handleColorSelect,
    handleImageUpload,
    getAvatarStyle
  } = useAvatarEditor(parsedUserData);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: parsedUserData.username,
      email: parsedUserData.email,
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedUserData = {
      ...parsedUserData,
      username: values.username,
      email: values.email,
      avatarColor: selectedColor,
      avatarImage: avatarPreview
    };
    
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    
    setTimeout(() => navigate('/account'), 1000);
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/account')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
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
                <AvatarEditor
                  username={form.getValues().username}
                  selectedColor={selectedColor}
                  avatarPreview={avatarPreview}
                  onColorSelect={handleColorSelect}
                  onImageUpload={handleImageUpload}
                  style={getAvatarStyle()}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" placeholder="Your username" {...field} />
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
                        <Input className="rounded-full" placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default EditAccount;
