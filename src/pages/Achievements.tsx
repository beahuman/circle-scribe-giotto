import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BadgeGallery from '@/components/achievements/BadgeGallery';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '@/components/common/LogoHeader';

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <LogoHeader size="small" clickable={false} />
          <div className="w-10" />
        </div>
        <div className="text-center pb-4">
          <h1 className="text-header bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-caption mt-2">
            Track your progress and unlock badges
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BadgeGallery />
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements;