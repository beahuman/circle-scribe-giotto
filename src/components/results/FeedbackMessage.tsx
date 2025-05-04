
import React from 'react';

interface FeedbackMessageProps {
  accuracy: number;
  isPenaltyMode?: boolean;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  accuracy,
  isPenaltyMode = false
}) => {
  // Enhanced snarky feedback messages based on accuracy score
  const getFeedbackMessage = (score: number, isPenalty = false) => {
    // Penalty mode has special extra sarcastic messages
    if (isPenalty) {
      return "Looks like someone needs to go back to kindergarten! Draw some basic shapes before attempting a circle again.";
    }
    
    if (score >= 95) return "Wow, did you use a compass? That's cheating! Or maybe you're secretly Giotto himself?";
    if (score >= 90) return "Almost suspiciously perfect. Did you trace it with your nose pressed against the screen?";
    if (score >= 85) return "Not bad! Giotto is still laughing, but not as hard as before.";
    if (score >= 80) return "Your art teacher called. She wants her 'participation trophy' back.";
    if (score >= 75) return "My toddler cousin drew a better circle with their eyes closed. During an earthquake.";
    if (score >= 70) return "I've seen rounder squares. Seriously, what was that supposed to be?";
    if (score >= 65) return "My grandmother can draw better circles in her sleep. And she doesn't have hands.";
    if (score >= 60) return "Was your finger having a seizure while drawing that?";
    if (score >= 50) return "Did you draw that with your eyes closed? Or maybe your elbow?";
    if (score >= 40) return "I'd call that a circle... if I were legally blind and extremely generous.";
    if (score >= 30) return "Are you sure that was supposed to be a circle? Looks more like a cat sat on your phone.";
    if (score >= 20) return "Did you mistake 'circle' for 'abstract modern art'? Because... wow.";
    if (score >= 18) return "That's not a circle, that's a cry for help. Have you considered finger painting instead?";
    if (score >= 16) return "If that's your idea of a circle, I'd hate to see what you think a straight line looks like.";
    if (score >= 14) return "Is your finger broken? Because that circle certainly is.";
    if (score >= 12) return "Congratulations! You've just invented a new shape. Let's call it 'The Blob'.";
    if (score >= 10) return "Even a drunk octopus could draw a better circle. And they have eight tentacles to manage!";
    if (score >= 8) return "Your circle has more corners than a dodecahedron. Impressive in all the wrong ways.";
    if (score >= 6) return "Did you draw that with your foot while riding a unicycle through an earthquake?";
    if (score >= 4) return "That's so misshapen, it could qualify as modern art. Quick, sell it for millions!";
    if (score >= 2) return "I've seen better circles drawn by a chicken pecking at random on a touchscreen.";
    if (score >= 0) return "That's not just bad, it's impressively bad. Like, award-winningly terrible.";
    
    return "That's more of a potato than a circle! Did you even try?";
  };

  return (
    <p className="text-muted-foreground max-w-xs mx-auto">
      {getFeedbackMessage(accuracy, isPenaltyMode)}
    </p>
  );
};

export default FeedbackMessage;
