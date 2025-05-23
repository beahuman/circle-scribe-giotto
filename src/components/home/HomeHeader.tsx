
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import LogoAnimation from '../LogoAnimation';
import WhyCirclesModal from '../WhyCirclesModal';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeHeader: React.FC = () => {
  return (
    <motion.div 
      className="space-y-2"
      variants={fadeVariants}
      transition={{ delay: 0.1 }}
    >
      <div className="w-[240px] mx-auto">
        <LogoAnimation />
      </div>
      <p className="text-muted-foreground">The art of the perfect circle</p>
      
      {/* Why Circles? Button */}
      <WhyCirclesModal>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <HelpCircle className="mr-1 h-3 w-3" />
          Why Circles?
        </Button>
      </WhyCirclesModal>
    </motion.div>
  );
};

export default HomeHeader;
