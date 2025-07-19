
import React from 'react';
import { motion } from 'framer-motion';
import { User, Info, BarChart3, HelpCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import WhyCirclesModal from '../WhyCirclesModal';
import UnifiedCard from './UnifiedCard';

interface HomeNavigationMenuProps {
  isGuestMode?: boolean;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeNavigationMenu: React.FC<HomeNavigationMenuProps> = ({ isGuestMode }) => {
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      name: "Progress",
      icon: BarChart3,
      action: () => navigate('/progress')
    },
    {
      name: "Account",
      icon: User,
      action: () => navigate('/account')
    }
  ];
  
  return (
    <motion.div 
      className="space-y-3"
      variants={fadeVariants}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Access your data and settings</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.name}
            variants={fadeVariants}
            transition={{ delay: index * 0.05 }}
          >
            <UnifiedCard
              variant="secondary"
              size="sm"
              interactive
              onClick={item.action}
              className="hover:shadow-sm transition-all duration-200"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-secondary-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-foreground">{item.name}</span>
              </div>
            </UnifiedCard>
          </motion.div>
        ))}
        
        <WhyCirclesModal>
          <UnifiedCard
            variant="secondary"
            size="sm"
            interactive
            className="hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-secondary-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-foreground">Why Circles?</span>
            </div>
          </UnifiedCard>
        </WhyCirclesModal>
      </div>
    </motion.div>
  );
};

export default HomeNavigationMenu;
