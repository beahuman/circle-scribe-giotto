
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CircleUser, Save, Upload, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Get data from localStorage if available, otherwise use default values
  const storedUserData = localStorage.getItem('userData');
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {
    username: 'GiottoMaster',
    email: 'artist@example.com',
    avatarColor: '#9b87f5',
    avatarImage: null
  };
  
  // Load any existing avatar image
  const [selectedColor, setSelectedColor] = useState(parsedUserData.avatarColor);
  
  // Initialize the avatar preview with the saved image if it exists
  React.useEffect(() => {
    if (parsedUserData.avatarImage) {
      setAvatarPreview(parsedUserData.avatarImage);
    }
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: parsedUserData.username,
      email: parsedUserData.email,
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Save form data, selected color and avatar image to localStorage
    const updatedUserData = {
      ...parsedUserData,
      username: values.username,
      email: values.email,
      avatarColor: selectedColor,
      avatarImage: avatarPreview  // Save the avatar image
    };
    
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    
    setTimeout(() => navigate('/account'), 1000);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const avatarColors = [
    '#9b87f5', '#F97316', '#33C3F0', '#8B5CF6', '#D3E4FD', '#FFDEE2'
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setAvatarPreview(null); // Clear any uploaded image when selecting a color
  };
  
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
                <div className="flex justify-center mb-8">
                  <div className="relative group">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden"
                      style={{ backgroundColor: avatarPreview ? 'transparent' : selectedColor }}
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        form.getValues().username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                      <Upload className="h-6 w-6 text-white" />
                    </label>
                    <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary shadow-lg">
                      <Edit className="h-4 w-4 text-white" />
                    </div>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                  {avatarColors.map((color) => (
                    <button 
                      key={color} 
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-transform ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} as avatar background color`}
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
