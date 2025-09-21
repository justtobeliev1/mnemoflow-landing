"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridBackground from "@/components/ui/grid-background";
import { FlowButton } from "@/components/ui/flow-button";

export function AnimatedHero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = useMemo(
    () => ["Effortless Flow", "Enlightening Moments", "Lasting Mastery"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleIndex((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleIndex, titles]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
      <GridBackground className="absolute inset-0 w-full h-full" hideMidLine startOnView />
      <div className="relative z-10 w-full px-6 md:px-12 text-center">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl tracking-tighter text-center font-regular">
              <span className="text-slate-100 font-light">Experience</span>
              <span className="relative block w-full h-16 md:h-24 overflow-visible">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titles[titleIndex]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-x-0 font-semibold whitespace-nowrap"
                  >
                    {titles[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-300 max-w-2xl text-center mt-2 md:mt-3">
              当 AI 的创造力，遇上你与生俱来的理解力，记忆便不再是负担，而是一场充满“原来如此”的流动之旅。
            </p>
          </div>

          <div className="flex flex-row gap-3 mt-4 md:mt-6">
            <FlowButton text="Enter the Flow" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnimatedHero;


