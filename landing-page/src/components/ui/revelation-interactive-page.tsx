"use client";

import React, { useState } from "react";
import GridBackground from "@/components/ui/grid-background";
import DisplayCards from "@/components/ui/display-cards";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  {
    icon: <Sparkles className="size-4" />,
    title: "蛮力链接的困境",
    description: "将大脑视作硬盘，而非网络",
    date: "",
    className:
      "[grid-area:stack] hover:-translate-y-16 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 hover:before:opacity-0 before:transition-opacity before:duration-700 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "被遗忘的复利",
    description: "你已知的，远比你想象的更有用",
    date: "",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-8 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 hover:before:opacity-0 before:transition-opacity before:duration-700 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "“无趣”才是最大的敌人",
    description: "“当学习的火花，被机械重复熄灭",
    date: "",
    className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const REVELATIONS: Array<React.ReactNode> = [
  (
    <div key="three" className="space-y-4">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">现象之痛：为何记单词如此“费力”？</h3>
      <p className="text-slate-300 leading-relaxed font-light">
        传统的“拼写-发-音-释义”方法，是一种<strong className="font-extrabold">蛮力链接</strong>。它强迫你的大脑进行孤立的、高强度的匹配工作，每一次记忆都是一次强行将两个神经元建立联系的苦旅。
      </p>
      <p className="text-slate-300 leading-relaxed font-light">
        这需要付出高昂的<strong className="font-extrabold">意志力成本</strong>，并且效率低下。因为这种方式完全忽略了大脑最擅长的事情——寻找模式和建立连接。你所进行的，是一种<strong className="font-extrabold">知识的线性增长</strong>，而非<strong className="font-extrabold">指数级成长</strong>。
      </p>
    </div>
  ),
  (
    <div key="two" className="space-y-4">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">根源之痛：我们浪费了什么？</h3>
      <p className="text-slate-300 leading-relaxed font-light">
        在记忆每一个“新”单词时，传统方法都默认你是一张“白纸”。然而，你的大脑早已是一个<strong className="font-extrabold">装满可复用知识的巨大知识库</strong>。
      </p>
      <div className="space-y-2 text-slate-300">
        <p className="font-light"><strong className="font-extrabold">你的母语：</strong>汉语的发音、字形、文化典故，本应是最佳的记忆锚点。</p>
        <p className="font-light"><strong className="font-extrabold">你的生活经验：</strong>所有的情感、故事、画面，本应是赋予单词生命力的调料。</p>
        <p className="font-light"><strong className="font-extrabold">你已有的知识网络：</strong>已经掌握的英文单词和语法逻辑，本应成为新知识的轴心。</p>
      </div>
      <p className="text-slate-300 leading-relaxed font-light">你的知识库本应像雪球一样越滚越大，但现在，它只是在艰难地堆沙成塔。</p>
    </div>
  ),
  (
    <div key="one" className="space-y-4">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">后果之痛：我们失去了什么？</h3>
      <p className="text-slate-300 leading-relaxed font-light">
        比效率低下更可怕的，是<strong className="font-extrabold">内在动机的枯竭</strong>。
      </p>
      <p className="text-slate-300 leading-relaxed font-light">
        机械重复的过程，不仅枯燥，更在持续不断地削弱我们最宝贵的东西：<strong className="font-extrabold">好奇心、成就感、以及探索未知的乐趣</strong>。
      </p>
      <p className="text-slate-300 leading-relaxed font-light">它创造了一个恶性循环：<br/> <strong className="font-extrabold">枯燥 → 抵触 → 遗忘 → 挫败</strong></p>
      <p className="text-slate-300 leading-relaxed font-light">当学习的火花被彻底熄灭，再高效的工具也无济于事。我们的最终目标，是<strong className="font-extrabold">将这场痛苦的“重复”，重新变回一场充满惊喜的“冒险”</strong>。</p>
    </div>
  ),
];

export default function RevelationInteractivePage() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary overflow-hidden relative">
      <GridBackground>
        <div className="relative z-10 min-h-screen flex flex-col w-full px-6 py-16 sm:px-8 md:px-16 md:py-24">
          <div className="w-full max-w-screen-2xl mx-auto">
            <h2 className="text-left font-extrabold tracking-tight text-2xl md:text-4xl lg:text-5xl">
              传统记词法，是如何浪费你的思维天赋的？
            </h2>
          </div>
          <div className="flex-grow flex items-center w-full">
            <div className="w-full max-w-screen-2xl mx-auto">
              <div className="grid grid-cols-1 gap-10 md:gap-16 lg:gap-20 md:grid-cols-12 w-full">
                {/* Left: interactive stacked cards */}
                <div className="md:col-span-5 w-full flex items-center justify-center">
                  <DisplayCards
                    cards={cards}
                    onCardHover={(idx) => setActive(idx)}
                    variant="dark"
                  />
                </div>

                {/* Right: dynamic revelation panel (no frame) */}
                <div className="md:col-span-7 w-full flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {REVELATIONS[active ?? 0]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridBackground>
    </section>
  );
}
