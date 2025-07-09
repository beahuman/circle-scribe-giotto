import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { Point } from '@/types/shapes';

interface OnboardingTutorialProps {
  onNext: () => void;
  onPrevious: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onNext, onPrevious }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targetCircle] = useState({
    x: 200,
    y: 150,
    radius: 80
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 300;
    
    drawCanvas();
  }, [drawnPoints]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw target circle (ghost)
    ctx.beginPath();
    ctx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(118, 94, 216, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw center dot
    ctx.beginPath();
    ctx.arc(targetCircle.x, targetCircle.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(118, 94, 216, 0.5)';
    ctx.fill();

    // Draw user's path
    if (drawnPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      
      for (let i = 1; i < drawnPoints.length; i++) {
        ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
      }
      
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setDrawnPoints([point]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const point = getCanvasPoint(e);
    setDrawnPoints(prev => [...prev, point]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (drawnPoints.length > 10) {
      setHasCompleted(true);
    }
  };

  const handleClear = () => {
    setDrawnPoints([]);
    setHasCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">Interactive Tutorial</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Try drawing a circle by following the dotted guide. Don't worry about perfection - 
          this is just to get familiar with the drawing mechanics.
        </p>
      </motion.div>

      {/* Drawing Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Play className="h-3 w-3" />
                Practice Mode
              </Badge>
              {hasCompleted && (
                <Badge className="bg-green-500 text-white flex items-center gap-2">
                  <CheckCircle className="h-3 w-3" />
                  Well Done!
                </Badge>
              )}
            </div>

            <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/20">
              <canvas
                ref={canvasRef}
                className="cursor-crosshair bg-white rounded border"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear & Try Again
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">👆</div>
            <h3 className="font-semibold mb-1">Click & Drag</h3>
            <p className="text-sm text-muted-foreground">
              Hold down your mouse button and drag to draw
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Follow the Guide</h3>
            <p className="text-sm text-muted-foreground">
              Try to trace along the dotted circle outline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">⭕</div>
            <h3 className="font-semibold mb-1">Complete the Circle</h3>
            <p className="text-sm text-muted-foreground">
              Connect the end back to the beginning
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Message */}
      {hasCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700 dark:text-green-300">Perfect!</h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                You've got the hang of it. Ready to learn about scoring?
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground">
            Give it a try! Draw a circle in the area above to continue.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingTutorial;