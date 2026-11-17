"use client";

import { forwardRef } from "react";
import { motion, type MotionValue } from "framer-motion";
import { APP_URL } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Guides() {
  return (
    <div className="guides" aria-hidden>
      <div>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

const TITLE = ["这一页看完，", "你会记住", "一个词"];

/**
 * 首屏的文案层。它是开场舞台（act-one.tsx）里的一层：往下滚时整体上移淡出，
 * 右边那四张卡片则飞进词海。右栏这里只放一个看不见的参考框，告诉词海卡片在首屏该摆在哪。
 */
export const HeroCopy = forwardRef<HTMLDivElement, { opacity: MotionValue<number>; y: MotionValue<number>; live: boolean }>(
  function HeroCopy({ opacity, y, live }, homeRef) {
    return (
      <div
        className="wrap absolute inset-0 grid grid-cols-[minmax(0,1fr)] items-center gap-y-10 pb-16 pt-28 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-y-16 lg:pb-24 lg:pt-32"
        style={{ pointerEvents: "none" }}
      >
        <motion.div
          className="relative z-10 max-lg:self-end"
          style={{ opacity, y, pointerEvents: live ? "auto" : "none", visibility: live ? "visible" : "hidden" }}
        >
          <h1 className="head whitespace-nowrap text-[clamp(2.9rem,6.7vw,6.1rem)] leading-[1.07] ![letter-spacing:-0.03em]">
            {TITLE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.18 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[27em] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.75] text-navy-soft"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          >
            Mnemoflow 是一款 AI 背单词应用。它先帮你把单词看懂，再在你快忘的时候提醒你。就这么简单。
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.72 }}
          >
            <a href={APP_URL} className="pill pill-navy h-12 px-6 text-[16px]">
              开始使用 <span className="chev">→</span>
            </a>
            <a href="#sea" className="group inline-flex items-center gap-2 text-[16px] font-semibold text-navy">
              先试一个词
              <motion.span aria-hidden animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                ↓
              </motion.span>
            </a>
          </motion.div>
        </motion.div>

        {/* 滚动提示：一根细线，一颗小点沿着它往下落 */}
        <motion.div aria-hidden style={{ opacity }} className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-navy/10 lg:block">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-navy/70"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.6, 0, 0.3, 1] }}
          />
        </motion.div>

        {/* 卡片的参考框：700×600，随断点缩放。词海引擎读它的位置来摆四张卡片 */}
        <div className="relative flex items-center justify-center max-lg:h-[300px] max-lg:self-start lg:-mr-36 lg:justify-start">
          <div ref={homeRef} aria-hidden className="h-[600px] w-[700px] shrink-0 origin-center scale-[0.5] sm:scale-[0.56] lg:origin-left lg:scale-[0.86] xl:scale-100" />
        </div>
      </div>
    );
  },
);
