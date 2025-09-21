"use client";

import React from "react";
import { motion } from "framer-motion";
import GridBackground from "@/components/ui/grid-background";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-pattern";
import { NoisePatternCard, NoisePatternCardBody } from "@/components/ui/card-with-noise-pattern";

const appear = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 2 * (i - 1), duration: 1.0, ease: "easeOut" },
  },
});

function sideMaskStyle(side: "left" | "right"): React.CSSProperties {
  // 仅一侧虚化：另一侧保持完全不虚化，避免文字被遮挡
  if (side === "left") {
    return {
      WebkitMaskImage:
        "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)",
      maskImage:
        "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)",
    } as React.CSSProperties;
  }
  return {
    WebkitMaskImage:
      "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)",
    maskImage:
      "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 100%)",
  } as React.CSSProperties;
}

export default function ToothpasteDialoguePage() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
      <GridBackground className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 w-full mx-auto max-w-5xl px-6 sm:px-8 md:px-12 py-16 md:py-24">
        <div className="space-y-8 md:space-y-10">
          {/* 1 左 */}
          <motion.div {...appear(1)} className="flex justify-start">
            <div
              className="relative w-fit max-w-[90vw] md:max-w-3xl -translate-x-1 md:-translate-x-10"
              style={sideMaskStyle("left")}
            >
              <GridPatternCard className="rounded-xl border-zinc-800 bg-zinc-950 w-full">
              <GridPatternCardBody className="pl-10 pr-6 md:pl-12 md:pr-8 py-8">
                <p className="text-lg md:text-xl font-semibold text-slate-100">
                  记忆大师是如何记住圆周率后几千位的？
                </p>
                <p className="mt-2 text-slate-300 text-sm md:text-base text-right">
                  ——发散与联想
                </p>
              </GridPatternCardBody>
              </GridPatternCard>
            </div>
          </motion.div>

          {/* 2 右 */}
          <motion.div {...appear(2)} className="flex justify-end">
            <div
              className="relative w-fit max-w-[90vw] md:max-w-3xl translate-x-1 md:translate-x-10"
              style={sideMaskStyle("right")}
            >
              <NoisePatternCard className="rounded-xl border-zinc-800 bg-zinc-950 w-full">
              <NoisePatternCardBody className="pl-6 pr-10 md:pl-8 md:pr-12 py-8">
                <p className="text-lg md:text-xl font-semibold text-slate-100">
                  助记法的核心与难点，在于第一步：
                </p>
                <p className="mt-2 text-slate-300 text-sm md:text-base">
                  如何从两个毫无关联的概念之间，找到巧妙的连接点？
                </p>
              </NoisePatternCardBody>
              </NoisePatternCard>
            </div>
          </motion.div>

          {/* 3 左 */}
          <motion.div {...appear(3)} className="flex justify-start">
            <div
              className="relative w-fit max-w-[90vw] md:max-w-3xl -translate-x-1 md:-translate-x-10"
              style={sideMaskStyle("left")}
            >
              <GridPatternCard className="rounded-xl border-zinc-800 bg-zinc-950 w-full">
              <GridPatternCardBody className="pl-10 pr-6 md:pl-12 md:pr-8 py-8">
                <p className="text-lg md:text-xl font-semibold text-slate-100">
                  这一步，曾是少数人的天赋
                </p>
                <p className="mt-2 text-slate-300 text-sm md:text-base">
                  但现在，AI 成为了你不知疲倦的、充满创造力的记忆伙伴
                </p>
              </GridPatternCardBody>
              </GridPatternCard>
            </div>
          </motion.div>

          {/* 4 右 */}
          <motion.div {...appear(4)} className="flex justify-end">
            <div
              className="relative w-fit max-w-[90vw] md:max-w-3xl translate-x-1 md:translate-x-10"
              style={sideMaskStyle("right")}
            >
              <NoisePatternCard className="rounded-xl border-zinc-800 bg-zinc-950 w-full">
              <NoisePatternCardBody className="pl-6 pr-10 md:pl-8 md:pr-12 py-8">
                <p className="text-lg md:text-xl font-semibold text-slate-100">
                  Mnemoflow 的 AI 引擎完成了最艰难的“0→1”创造。
                </p>
                <p className="mt-2 text-slate-300 text-sm md:text-base">
                  而你，只需动用人类与生俱来的天赋
                  <br />
                  ——理解、审视、并沿着这条 AI 铺设好的逻辑路径，
                  <br />
                  轻松地走完从“1→100”的内化过程。
                </p>
              </NoisePatternCardBody>
              </NoisePatternCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


