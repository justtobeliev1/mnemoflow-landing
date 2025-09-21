"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import GridBackground from "@/components/ui/grid-background";
import { motion } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface GradientStyle {
  left: string;
  top: string;
  opacity: number;
}

const DigitalSerenity = () => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState<GradientStyle>({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<HTMLElement[]>([]);
  const { ref, isVisible } = useScrollTrigger({ threshold: 0.1 });

  // Simplified word animation trigger, now controlled by framer-motion directly
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.3,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    },
  };

  const subtitle = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: 1.2,
      },
    },
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  
  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements) as HTMLElement[];
    // This effect is now controlled by isVisible from useScrollTrigger
  }, []);

  useEffect(() => {
    if (isVisible && !scrolled) {
      setScrolled(true); // Fire only once
      floatingElementsRef.current.forEach((el, index) => {
        setTimeout(() => {
          if (el instanceof HTMLElement) {
            el.style.animationPlayState = 'running';
            el.style.opacity = '';
          }
        }, (parseFloat((el as HTMLElement).style.animationDelay || "0") * 1000) + index * 100);
      });
    }
  }, [isVisible, scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
  `;

  return (
    <>
      <style>{pageStyles}</style>
      <div ref={ref} className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary overflow-hidden relative">
        <GridBackground startOnView>
          {/* Responsive Corner Elements */}
          <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8" style={{ animationDelay: '4s' }}>
            <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" style={{ animationDelay: '4.6s' }}>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="floating-element-animate" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
          <div className="floating-element-animate" style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
          <div className="floating-element-animate" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
          <div className="floating-element-animate" style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

          {/* Responsive Main Content Padding */}
          <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20">
            <div className="text-center">
              <h2 className="text-xs sm:text-sm font-mono font-light text-slate-300 uppercase tracking-[0.2em] opacity-80">
                <motion.span variants={letter}>Mnemoflow</motion.span> <motion.span variants={letter}>Design</motion.span> <motion.span variants={letter}>Philosophy</motion.span>
              </h2>
              <div className="mt-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto"></div>
            </div>

            <div className="text-center max-w-5xl mx-auto relative">
              {/* Responsive Main Heading Sizes */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-slate-50 text-decoration-animate"
                variants={sentence}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
              >
                <div className="mb-8 md:mb-12 whitespace-nowrap">
                  {'记忆的第一性原理'.split('').map((char, index) => (
                    <motion.span key={index} variants={letter}>
                      {char}
                    </motion.span>
                  ))}
                </div>
                {/* Responsive Secondary Heading Sizes & Added tracking-wide for letter spacing */}
                <motion.div 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-thin text-slate-300 leading-relaxed tracking-wide text-right pr-8"
                  variants={subtitle}
                >
                  ——创建连接，而非机械记忆
                </motion.div>
              </motion.h1>
              {/* Responsive Detail Line Offsets */}
              <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3.2s' }}></div>
              <div className="absolute -right-6 sm:-right-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3.4s' }}></div>
            </div>

            <div className="text-center">
              <div className="mb-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto"></div>
              <motion.h2 
                className="text-xs sm:text-sm font-mono font-light text-slate-300 uppercase tracking-[0.2em] opacity-80"
                variants={sentence}
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
              >
                <motion.span variants={letter}>Flow</motion.span> <motion.span variants={letter}>State</motion.span> <motion.span variants={letter}>Learning</motion.span>
              </motion.h2>
              <div className="mt-6 flex justify-center space-x-4 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '4.2s' }}>
                <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full opacity-60"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>

          {/* Responsive Mouse Gradient Size & Blur */}
          <div
            id="mouse-gradient-react"
            className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
            style={{
              left: mouseGradientStyle.left,
              top: mouseGradientStyle.top,
              opacity: mouseGradientStyle.opacity,
            }}
          ></div>

          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="ripple-effect"
              style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
            ></div>
          ))}
        </GridBackground>
      </div>
    </>
  );
};

export default DigitalSerenity;