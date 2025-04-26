
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface UserAvatarData {
  username: string;
  email: string;
  avatarColor: string;
  avatarImage: string | null;
}

export const useAvatarEditor = (initialData: UserAvatarData) => {
  const [selectedColor, setSelectedColor] = useState(initialData.avatarColor);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatarImage);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData.avatarImage) {
      setAvatarPreview(initialData.avatarImage);
    }
  }, [initialData.avatarImage]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setAvatarPreview(null); // Clear any uploaded image when selecting a color
  };

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

  const getAvatarStyle = () => ({
    backgroundColor: avatarPreview ? 'transparent' : selectedColor
  });

  return {
    selectedColor,
    avatarPreview,
    handleColorSelect,
    handleImageUpload,
    getAvatarStyle,
    setSelectedColor,
    setAvatarPreview
  };
};
