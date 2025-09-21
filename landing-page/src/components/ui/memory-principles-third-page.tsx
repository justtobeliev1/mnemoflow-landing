"use client";

import React, { useState, useEffect, useRef } from 'react';

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

const MemoryPrinciplesThirdPage = () => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState<GradientStyle>({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll('.word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay') || '0');
        setTimeout(() => {
          if (word instanceof HTMLElement) word.style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 500);
    return () => clearTimeout(timeoutId);
  }, []);

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
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const wordElements = document.querySelectorAll('.word-animate');
    const handleMouseEnter = (e: Event) => { if (e.target instanceof HTMLElement) e.target.style.textShadow = '0 0 20px rgba(203, 213, 225, 0.5)'; };
    const handleMouseLeave = (e: Event) => { if (e.target instanceof HTMLElement) e.target.style.textShadow = 'none'; };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements) as HTMLElement[];
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el instanceof HTMLElement) {
              el.style.animationPlayState = 'running';
              el.style.opacity = '';
            }
          }, (parseFloat((el as HTMLElement).style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

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
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .word-animate:hover { color: #cbd5e1; transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }
    .paragraph-animate { opacity: 0; transform: translateY(30px); animation: paragraph-appear 1s ease-out forwards; }
    @keyframes paragraph-appear { to { opacity: 1; transform: translateY(0); } }
  `;

  return (
    <>
      <style>{pageStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary overflow-hidden relative">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
        </svg>

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

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-20 sm:px-8 md:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            {/* 引导语部分 */}
            <div className="space-y-8">
              <div className="paragraph-animate" style={{ animationDelay: '0.5s' }}>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed">
                  <span className="word-animate" data-delay="700">你的大脑</span>
                  <span className="word-animate" data-delay="900">每秒能处理</span>
                  <span className="word-animate" data-delay="1100">400亿条信息</span>
                </p>
              </div>
              
              <div className="paragraph-animate" style={{ animationDelay: '1s' }}>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed">
                  <span className="word-animate" data-delay="1300">却在记一个单词上</span>
                  <span className="word-animate" data-delay="1500">耗费数小时</span>
                </p>
              </div>
              
              <div className="paragraph-animate" style={{ animationDelay: '1.5s' }}>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100">
                  <span className="word-animate" data-delay="1700">问题不是你，</span>
                  <span className="word-animate" data-delay="1900">是方法</span>
                </p>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto paragraph-animate" style={{ animationDelay: '2s' }}></div>

            {/* 大脑原理部分 */}
            <div className="space-y-8">
              <div className="paragraph-animate" style={{ animationDelay: '2.5s' }}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50 mb-6">
                  <span className="word-animate" data-delay="2100">大脑，</span>
                  <span className="word-animate" data-delay="2300">为连接而生</span>
                </h2>
              </div>

              <div className="space-y-6 text-left max-w-3xl mx-auto">
                <div className="paragraph-animate" style={{ animationDelay: '3s' }}>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="word-animate" data-delay="2500">记忆的本质，</span>
                    <span className="word-animate" data-delay="2700">是在数以亿计的神经元之间</span>
                    <span className="word-animate" data-delay="2900">建立新的突触连接</span>
                  </p>
                </div>

                <div className="paragraph-animate" style={{ animationDelay: '3.5s' }}>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="word-animate" data-delay="3100">一个被有效连接的信息，</span>
                    <span className="word-animate" data-delay="3300">会成为神经网络中的一个坚固节点，</span>
                    <span className="word-animate" data-delay="3500">可以被随时、轻松地调用</span>
                  </p>
                </div>

                <div className="paragraph-animate" style={{ animationDelay: '4s' }}>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="word-animate" data-delay="3700">而一个孤立的信息，</span>
                    <span className="word-animate" data-delay="3900">难以被抵达，</span>
                    <span className="word-animate" data-delay="4100">容易被遗忘</span>
                  </p>
                </div>

                <div className="paragraph-animate" style={{ animationDelay: '4.5s' }}>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="word-animate" data-delay="4300">它痴迷于逻辑、</span>
                    <span className="word-animate" data-delay="4500">故事和情感。</span>
                    <span className="word-animate" data-delay="4700">它渴望理解"为什么"，</span>
                    <span className="word-animate" data-delay="4900">而不是被迫接受"是什么"</span>
                  </p>
                </div>

                <div className="paragraph-animate" style={{ animationDelay: '5s' }}>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="word-animate" data-delay="5100">然而，传统记词法</span>
                    <span className="word-animate" data-delay="5300">却强迫它处理无数孤立的数据点。</span>
                    <span className="word-animate" data-delay="5500">我们却一直在用大脑最"讨厌"的方式折磨它</span>
                  </p>
                </div>
              </div>
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
      </div>
    </>
  );
};

export default MemoryPrinciplesThirdPage;
