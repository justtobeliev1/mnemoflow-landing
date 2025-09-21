"use client";

import { motion } from "framer-motion";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";

export function AboutSection() {
  const { ref, isVisible } = useScrollTrigger();

  return (
    <section ref={ref} id="about-section" className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-50 mb-8">
              关于 Mnemoflow
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              基于认知科学原理的记忆学习平台，帮助您建立有效的知识连接。
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}