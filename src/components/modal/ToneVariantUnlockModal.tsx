import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, GraduationCap, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToneType } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';

interface ToneVariantUnlockModalProps {
  baseTone: ToneType;
  variant: ToneType;
  isOpen: boolean;
  onClose: () => void;
}

const ToneVariantUnlockModal: React.FC<ToneVariantUnlockModalProps> = ({
  baseTone,
  variant,
  isOpen,
  onClose
}) => {
  const { changeTone, getPreviewMessage } = useToneSystem();

  if (!isOpen) return null;

  const getVariantIcon = (variant: ToneType) => {
    switch (variant) {
      case 'romantic': return Heart;
      case 'poetic': return BookOpen;
      case 'philosophical': return GraduationCap;
      case 'darkHumor': return Skull;
      default: return Heart;
    }
  };

  const getVariantDescription = (variant: ToneType) => {
    switch (variant) {
      case 'romantic': return 'Dreamlike, warm, emotionally expressive';
      case 'poetic': return 'Sparse, lyrical, abstract';
      case 'philosophical': return 'Logical, reflective, existential';
      case 'darkHumor': return 'Morbid, dry, strange but endearing';
      default: return 'A new way to experience feedback';
    }
  };

  const handleTryNewTone = () => {
    changeTone(variant);
    onClose();
  };

  const Icon = getVariantIcon(variant);
  const previewMessage = getPreviewMessage(variant);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background p-6 rounded-lg max-w-md w-full border"
      >
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <Icon className="h-8 w-8 text-primary" />
          </motion.div>

          {/* Unlock Message */}
          <div className="space-y-2">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold"
            >
              New Tone Variant Unlocked
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              You've stayed true to your voice. A new tone emerges...
            </motion.p>
          </div>

          {/* Variant Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-muted/20 rounded-lg space-y-3"
          >
            <div className="text-center">
              <h4 className="font-semibold capitalize text-lg">{variant}</h4>
              <p className="text-sm text-muted-foreground">
                {getVariantDescription(variant)}
              </p>
            </div>

            <div className="border-t pt-3">
              <p className="text-caption mb-2">Preview:</p>
              <p className="text-description">"{previewMessage}"</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Keep Current Tone
            </Button>
            <Button
              onClick={handleTryNewTone}
              className="flex-1"
            >
              Try New Tone
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToneVariantUnlockModal;