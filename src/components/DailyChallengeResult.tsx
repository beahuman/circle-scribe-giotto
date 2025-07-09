import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import BadgeShowcase from './BadgeShowcase';

interface DailyChallengeResultProps {
  score: number;
  targetScore: number;
  difficultyLevel: number;
  onContinue: () => void;
  className?: string;
}

const DailyChallengeResult: React.FC<DailyChallengeResultProps> = ({
  score,
  targetScore,
  difficultyLevel,
  onContinue,
  className = ""
}) => {
  const { completeDailyChallenge, userBadges } = useDailyChallenges();
  const roundedScore = Math.round(score * 100) / 100;
  const isPassing = roundedScore >= targetScore;
  const isExcellent = roundedScore >= 90;

  // Record completion when component mounts
  useEffect(() => {
    const recordCompletion = async () => {
      try {
        await completeDailyChallenge(roundedScore);
      } catch (error) {
        console.error('Failed to record daily challenge completion:', error);
      }
    };

    recordCompletion();
  }, [roundedScore, completeDailyChallenge]);

  const getDifficultyLabel = (level: number) => {
    const labels = {
      1: 'Novice',
      2: 'Apprentice', 
      3: 'Skilled',
      4: 'Expert',
      5: 'Master'
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  };

  const getDifficultyColor = (level: number) => {
    const colors = {
      1: 'bg-green-500 text-white',
      2: 'bg-blue-500 text-white',
      3: 'bg-yellow-500 text-black',
      4: 'bg-orange-500 text-white', 
      5: 'bg-red-500 text-white'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Result Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge className={getDifficultyColor(difficultyLevel)}>
            Level {difficultyLevel} - {getDifficultyLabel(difficultyLevel)}
          </Badge>
        </div>

        {/* Challenge Complete Banner */}
        <Card className={`border-2 ${isPassing ? 'border-green-500/50 bg-green-500/10' : 'border-orange-500/50 bg-orange-500/10'}`}>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className="text-4xl mb-2">
                {isExcellent ? '🏆' : isPassing ? '✅' : '🎯'}
              </div>
              
              <h2 className="text-2xl font-bold">
                {isExcellent ? 'Exceptional!' : isPassing ? 'Challenge Complete!' : 'Good Effort!'}
              </h2>
              
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{roundedScore}%</div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
                
                <div className="text-2xl text-muted-foreground">vs</div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-muted-foreground">{targetScore}%</div>
                  <div className="text-sm text-muted-foreground">Target</div>
                </div>
              </div>

              {isPassing && (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Daily challenge conquered!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* XP Reward */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full"
        >
          <Star className="h-4 w-4" />
          <span className="font-medium">+{Math.round(roundedScore)} XP earned!</span>
        </motion.div>
      </motion.div>

      {/* Recently Earned Badges */}
      {userBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Latest Badges
              </h3>
              <BadgeShowcase badges={userBadges.slice(0, 3)} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="text-center"
      >
        <Button 
          onClick={onContinue}
          size="lg"
          className="px-8 py-4 text-lg rounded-full"
        >
          Return to Challenges
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          Come back tomorrow for a new challenge!
        </p>
      </motion.div>
    </div>
  );
};

export default DailyChallengeResult;