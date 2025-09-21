"use client";

import { motion } from "framer-motion";
import DigitalSerenity from "./ui/digital-serenity-animated-landing-page";

export function AboutSection() {
  return (
    <section id="about-section" className="relative min-h-screen">
      {/* Digital Serenity Background */}
      <div className="absolute inset-0">
        <DigitalSerenity />
      </div>

      {/* Content Overlay - Placeholder for future content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Placeholder Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                  Design Philosophy
                </span>
              </h2>
              <p className="text-white/60 text-lg">
                Content coming soon...
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}