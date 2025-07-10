import React from 'react';
import { motion } from 'framer-motion';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';

interface ScoreBreakdownProps {
  subscores?: GeometricSubscores | null;
  overallScore: number;
  feedbackTone: 'playful' | 'calm' | 'formal' | 'sarcastic';
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  subscores,
  overallScore,
  feedbackTone
}) => {
  const getFeedbackMessage = (score: number, metric: string, tone: string) => {
    const messages = {
      playful: {
        symmetry: {
          excellent: "🎯 Your circle is so round, even compasses are jealous!",
          good: "🌟 Nice symmetry! You're getting the hang of this.",
          fair: "🔄 Getting there! Your circle has character.",
          poor: "🎨 Abstract art vibes! Let's work on that roundness."
        },
        smoothness: {
          excellent: "✨ Butter-smooth drawing! Your hand is a precision instrument.",
          good: "🌊 Smooth sailing! Nice consistent motion.",
          fair: "🏃 A bit jittery, but you're finding your rhythm.",
          poor: "🎢 That was quite the roller coaster ride!"
        },
        alignment: {
          excellent: "🎯 Perfect connection! Start and end are best friends.",
          good: "🤝 Nice closure! Almost seamless.",
          fair: "🔗 Close call! Just a small gap to bridge.",
          poor: "🌉 There's a gap that needs some bridge-building!"
        }
      },
      calm: {
        symmetry: {
          excellent: "Excellent symmetry. Your spatial awareness is well-developed.",
          good: "Good symmetrical form. You're developing strong motor control.",
          fair: "Moderate symmetry. Practice will enhance this skill.",
          poor: "Focus on maintaining even distance from the center."
        },
        smoothness: {
          excellent: "Beautiful fluid motion. Your neuromuscular coordination is excellent.",
          good: "Smooth, controlled movement. Well-developed motor skills.",
          fair: "Some minor fluctuations. Relaxation will improve smoothness.",
          poor: "Work on maintaining steady, controlled movements."
        },
        alignment: {
          excellent: "Perfect start-end alignment. Excellent spatial completion.",
          good: "Well-connected endpoints. Good spatial awareness.",
          fair: "Minor gap present. Focus on completing the circular path.",
          poor: "Significant gap detected. Practice circular completion."
        }
      },
      formal: {
        symmetry: {
          excellent: "Symmetry score: Exceptional. Demonstrates superior spatial-motor integration.",
          good: "Symmetry score: Proficient. Indicates well-developed visuomotor skills.",
          fair: "Symmetry score: Developing. Continued practice recommended.",
          poor: "Symmetry score: Below target. Focus on radial consistency required."
        },
        smoothness: {
          excellent: "Smoothness score: Outstanding. Exhibits optimal motor control fluency.",
          good: "Smoothness score: Competent. Shows good neuromuscular coordination.",
          fair: "Smoothness score: Moderate. Minor motor fluctuations observed.",
          poor: "Smoothness score: Suboptimal. Significant motor variability detected."
        },
        alignment: {
          excellent: "Alignment score: Perfect. Demonstrates precise spatial closure.",
          good: "Alignment score: Good. Adequate endpoint coordination achieved.",
          fair: "Alignment score: Fair. Minor spatial gap requires attention.",
          poor: "Alignment score: Poor. Significant spatial discontinuity present."
        }
      },
      sarcastic: {
        symmetry: {
          excellent: "Wow, did you use a secret circle-drawing cheat code?",
          good: "Not bad! Your circle isn't trying to escape anymore.",
          fair: "It's... definitely circle-adjacent. Progress!",
          poor: "That's what we call 'creatively asymmetrical.' Very avant-garde."
        },
        smoothness: {
          excellent: "Did you practice with a meditation master? So zen.",
          good: "Pretty smooth! Only a few speed bumps along the way.",
          fair: "Your hand had some opinions about direction changes.",
          poor: "Was there an earthquake while you were drawing?"
        },
        alignment: {
          excellent: "Perfect closure! Did you plan that or just get lucky?",
          good: "Almost connected! Just a tiny gap for artistic flair.",
          fair: "There's a gap, but hey, it adds character.",
          poor: "That gap is so big, it has its own ZIP code."
        }
      }
    };

    const getLevel = (score: number) => {
      if (score >= 90) return 'excellent';
      if (score >= 75) return 'good';
      if (score >= 60) return 'fair';
      return 'poor';
    };

    const level = getLevel(score);
    return messages[tone]?.[metric]?.[level] || `${metric}: ${score.toFixed(1)}%`;
  };

  const scoreItems = [
    {
      label: "Symmetry Accuracy",
      score: subscores?.strokeDeviation ?? 0,
      description: "How well your circle follows the perfect circular path",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      metric: "symmetry"
    },
    {
      label: "Stroke Smoothness", 
      score: subscores?.angularSmoothness ?? 0,
      description: "The fluidity and consistency of your drawing motion",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      metric: "smoothness"
    },
    {
      label: "Start/End Alignment",
      score: subscores?.completionOffset ?? 0,
      description: "How well you connected the beginning and end points",
      color: "from-purple-500 to-purple-600", 
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      metric: "alignment"
    }
  ];

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Overall Score */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
          {overallScore.toFixed(1)}%
        </div>
        <p className="text-sm text-muted-foreground">Overall Precision Score</p>
      </motion.div>

      {/* Individual Scores */}
      <div className="space-y-3">
        {scoreItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            className={`rounded-lg p-4 ${item.bgColor} border ${item.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">{item.label}</span>
              <span className="text-lg font-bold">
                {item.score.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress bar with gradient */}
            <div className="w-full bg-muted/50 rounded-full h-2 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
              />
            </div>
            
            {/* Feedback message */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-xs text-muted-foreground mb-2"
            >
              {item.description}
            </motion.p>
            
            {/* Tone-specific feedback */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-xs font-medium"
            >
              {getFeedbackMessage(item.score, item.metric, feedbackTone)}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;