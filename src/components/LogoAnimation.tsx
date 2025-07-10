
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LogoAnimationProps {
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ className = '' }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  
  useEffect(() => {
    // Load the animated circles logo from public directory
    fetch('/GiottoAnimatedLogo.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading animation:', error);
        // If loading fails, use a simple rotating circle animation
        setAnimationData({
          v: "5.7.8",
          fr: 30,
          ip: 0,
          op: 120,
          w: 240,
          h: 240,
          nm: "Animated Circles Logo",
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: "Circle",
              sr: 1,
              ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: {
                  a: 1,
                  k: [
                    { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                    { t: 120, s: [360] }
                  ],
                  ix: 10
                },
                p: { a: 0, k: [120, 120, 0], ix: 2, l: 2 },
                s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
              },
              ao: 0,
              shapes: [
                {
                  ty: "gr",
                  it: [
                    {
                      d: 1,
                      ty: "el",
                      s: { a: 0, k: [100, 100], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      nm: "Ellipse Path 1",
                      mn: "ADBE Vector Shape - Ellipse",
                      hd: false
                    },
                    {
                      ty: "st",
                      c: { a: 0, k: [0.6, 0.4, 0.95, 1], ix: 3 },
                      o: { a: 0, k: 100, ix: 4 },
                      w: { a: 0, k: 6, ix: 5 },
                      lc: 1,
                      lj: 1,
                      ml: 4,
                      bm: 0,
                      nm: "Stroke 1",
                      mn: "ADBE Vector Graphic - Stroke",
                      hd: false
                    }
                  ]
                }
              ],
              ip: 0,
              op: 120,
              st: 0,
              bm: 0
            }
          ]
        });
      });
  }, []);

  if (!animationData) {
    return (
      <div className={`w-[240px] h-[240px] flex items-center justify-center ${className}`}>
        <div className="w-24 h-24 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`w-[240px] ${className}`}>
      <Lottie 
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-full h-auto"
      />
    </div>
  );
};

export default LogoAnimation;

