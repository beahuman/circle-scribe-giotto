import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Link, TrendingUp } from 'lucide-react';

interface OnboardingMetricsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const OnboardingMetrics: React.FC<OnboardingMetricsProps> = ({ onNext, onPrevious }) => {
  const metrics = [
    {
      icon: Target,
      name: "Symmetry",
      description: "How well your circle follows the perfect circular path",
      neuroscienceInfo: "Measures parietal cortex spatial processing and hand-eye coordination",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      examples: [
        { score: 95, description: "Nearly perfect circular path" },
        { score: 70, description: "Good overall shape with minor deviations" },
        { score: 40, description: "Recognizable circle but wobbly edges" }
      ]
    },
    {
      icon: Zap,
      name: "Smoothness",
      description: "How fluid and consistent your drawing motion is",
      neuroscienceInfo: "Reflects cerebellum function and motor control coordination",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      examples: [
        { score: 90, description: "Perfectly smooth, flowing motion" },
        { score: 65, description: "Mostly smooth with occasional jerky movements" },
        { score: 35, description: "Choppy motion with frequent direction changes" }
      ]
    },
    {
      icon: Link,
      name: "Closure",
      description: "How well you connect the start and end points",
      neuroscienceInfo: "Tests prefrontal cortex motor planning and execution",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      examples: [
        { score: 100, description: "Perfect connection, no visible gap" },
        { score: 75, description: "Small gap between start and end" },
        { score: 50, description: "Noticeable gap or overlap" }
      ]
    },
    {
      icon: TrendingUp,
      name: "Overall Score",
      description: "Weighted combination of all metrics",
      neuroscienceInfo: "Holistic measure of motor cortex and cognitive integration",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      examples: [
        { score: 85, description: "Excellent performance across all metrics" },
        { score: 65, description: "Good performance with room for improvement" },
        { score: 45, description: "Keep practicing - improvement is coming!" }
      ]
    }
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">Understanding Your Scores</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every circle you draw is analyzed across multiple dimensions. 
          Here's what each metric measures and why it matters for your brain training.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${metric.borderColor} border-2 ${metric.bgColor}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{metric.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {metric.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      🧠 {metric.neuroscienceInfo}
                    </Badge>
                  </div>
                </div>

                {/* Score Examples */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Score Examples:</h4>
                  {metric.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={`
                            ${example.score >= 80 ? 'bg-green-500 text-white' : 
                              example.score >= 60 ? 'bg-yellow-500 text-black' : 
                              'bg-red-500 text-white'}
                          `}
                        >
                          {example.score}%
                        </Badge>
                        <span className="text-sm">{example.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scoring Philosophy */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-3">Our Scoring Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-2xl mb-2">📈</div>
                <h3 className="font-semibold mb-1">Progress Over Perfection</h3>
                <p className="text-muted-foreground">
                  Focus on gradual improvement rather than perfect scores
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-1">Science-Based</h3>
                <p className="text-muted-foreground">
                  Metrics designed to reflect real neurological improvements
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Actionable Feedback</h3>
                <p className="text-muted-foreground">
                  Each score provides specific areas for focused practice
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ready Message */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <h2 className="text-xl font-semibold mb-2">Ready to See It in Action?</h2>
        <p className="text-muted-foreground">
          Now you understand how scoring works. Let's complete your onboarding!
        </p>
      </motion.div>
    </div>
  );
};

export default OnboardingMetrics;