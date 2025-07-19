
import React from 'react';
import { Edit, Upload } from 'lucide-react';
import { UserAvatarData } from '@/hooks/useAvatarEditor';

interface AvatarEditorProps {
  username: string;
  selectedColor: string;
  avatarPreview: string | null;
  onColorSelect: (color: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style: React.CSSProperties;
}

export const avatarColors = [
  '#9b87f5', '#F97316', '#33C3F0', '#8B5CF6', '#D3E4FD', '#FFDEE2'
];

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  username,
  selectedColor,
  avatarPreview,
  onColorSelect,
  onImageUpload,
  style
}) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden"
            style={style}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              username.charAt(0).toUpperCase()
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
            onChange={onImageUpload}
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mb-6">
        {avatarColors.map((color) => (
          <button 
            key={color} 
            type="button"
            onClick={() => onColorSelect(color)}
            className={`w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-transform ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
            style={{ backgroundColor: color }}
            aria-label={`Select ${color} as avatar background color`}
          />
        ))}
      </div>
    </>
  );
};
