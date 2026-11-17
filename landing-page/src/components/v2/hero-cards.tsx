"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePhase, useTyped } from "./hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 首屏的四张产品界面卡片，各自循环演示一个功能。
 * 它们的位置不在这里定：由词海（word-sphere.tsx）接管——首屏时按透视叠放，往下滚就飞上球面。
 */
export const HERO_CARDS = [
  { width: 500, Card: LearnCard },
  { width: 280, Card: QuizCard },
  { width: 310, Card: RateCard },
  { width: 270, Card: ChatCard },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[11px] font-medium tracking-[0.08em] text-white/40">{children}</div>;
}

/* ───────── 学习卡：词典释义 + 助记蓝图 + 记忆场景 ───────── */

const LEARN_MARKS = [900, 1700, 2600, 3300] as const;

function LearnCard() {
  const phase = usePhase(true, LEARN_MARKS, 9000);
  const hl = (on: boolean) => ({
    initial: false as const,
    animate: { backgroundSize: on ? "100% 100%" : "0% 100%" },
    transition: { duration: 0.7, ease: EASE },
  });

  return (
    <div className="glass p-7">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[32px] font-bold leading-none tracking-[-0.02em]">quintessential</div>
          <div className="mt-2.5 flex items-center gap-3 text-[13px] text-white/45">
            <span>/ˌkwɪntɪˈsenʃl/</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">adj.</span>
            <span className="text-white/80">精髓的；典范的</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { part: "quint", to: "Queen’s", zh: "女王的", on: phase >= 1 },
          { part: "essential", to: "essential", zh: "必要的", on: phase >= 2 },
        ].map((it) => (
          <div key={it.part} className="well px-4 py-3">
            <div className="text-[12px] text-white/45">{it.part}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <motion.span className="hl-flow text-[17px] font-semibold" {...hl(it.on)}>
                {it.to}
              </motion.span>
              <span className="text-[12px] text-white/55">{it.zh}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Eyebrow>记忆场景</Eyebrow>
        <p className="mt-2 text-[14px] leading-[1.8] text-white/75">
          女王从容地倒了一杯茶：「优雅、沉着与仁慈，这些都是
          <motion.span className="hl-flow text-white" {...hl(phase >= 3)}>
            女王的
          </motion.span>{" "}
          <motion.span className="hl-flow text-white" {...hl(phase >= 4)}>
            必要
          </motion.span>
          品质。」
        </p>
      </div>
    </div>
  );
}

/* ───────── 复习卡：选错不判错，亮出线索再选 ───────── */

const QUIZ_MARKS = [1600, 2500, 4400] as const;
const OPTIONS = ["完全相同的", "绝望的", "迥然不同的", "分散的"];

function QuizCard() {
  // 0 出题 → 1 选错 → 2 亮出线索 → 3 选对
  const phase = usePhase(true, QUIZ_MARKS, 8000);
  return (
    <div className="glass p-5">
      <Eyebrow>复习</Eyebrow>
      <div className="mt-2 text-[22px] font-bold tracking-[-0.01em]">disparate</div>

      <div className="mt-1 h-[34px]">
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="well inline-flex items-center gap-1.5 !rounded-lg px-2.5 py-1.5 text-[12px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="text-white/45">线索</span>
              <span className="hl-flow">dis 不</span>
              <span className="hl-flow">pa 爸</span>
              <span className="hl-flow">rate 水准</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 grid gap-2">
        {OPTIONS.map((opt, i) => {
          const wrong = i === 1 && phase >= 1;
          const right = i === 2 && phase >= 3;
          return (
            <motion.div
              key={opt}
              className={cn(
                "rounded-xl px-3 py-2 text-center text-[13px] transition-all duration-300",
                right
                  ? "bg-white font-semibold text-coal shadow-[0_8px_24px_-8px_rgb(255_255_255/0.6)]"
                  : wrong
                    ? "text-white/25 line-through shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)]"
                    : "well text-white/85",
              )}
              animate={wrong && phase === 1 ? { x: [0, -5, 5, -3, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {opt}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── 评级卡 ───────── */

const RATE_MARKS = [1800, 3600, 5400] as const;
const RATINGS = ["忘记", "困难", "良好", "简单"];
const RATE_ORDER = [2, 3, 1, 2];

function RateCard() {
  const phase = usePhase(true, RATE_MARKS, 7200);
  const picked = RATE_ORDER[phase];
  return (
    <div className="glass p-5">
      <Eyebrow>请为您的记忆评级</Eyebrow>
      <div className="relative mt-3 grid grid-cols-4 gap-2">
        {RATINGS.map((r, i) => (
          <div
            key={r}
            className={cn(
              "relative rounded-xl py-2.5 text-center text-[13px] transition-colors duration-300",
              i === picked ? "text-white" : "well text-white/60",
            )}
          >
            {i === picked && (
              <motion.span
                layoutId="rate-pick"
                className="absolute inset-0 rounded-xl bg-flow shadow-[0_8px_22px_-8px_rgb(var(--g2)/0.9),inset_0_1px_0_rgb(255_255_255/0.35)]"
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              />
            )}
            <span className="relative font-medium">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── AI 问答卡 ───────── */

const CHAT_MARKS = [1000, 1900] as const;
const ANSWER = "temporary 只是「不永久」；ephemeral 强调转瞬即逝，带一点诗意。";

function ChatCard() {
  // 0 提问 → 1 输入中 → 2 流式回答
  const phase = usePhase(true, CHAT_MARKS, 9500);
  const typed = useTyped(ANSWER, phase >= 2);
  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-flow" />
        <Eyebrow>AI问答小栈 — ephemeral</Eyebrow>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-[12.5px] leading-[1.6]">
        <div className="self-end rounded-xl rounded-br-sm bg-white px-3 py-1.5 font-medium text-coal">
          它和 temporary 有什么区别？
        </div>
        <div className="well min-h-[62px] !rounded-xl !rounded-bl-sm px-3 py-2 text-white/85">
          {phase < 2 ? (
            <span className="flex h-[20px] items-center gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-white/60"
                  animate={{ opacity: phase === 1 ? [0.25, 1, 0.25] : 0.25 }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </span>
          ) : (
            typed
          )}
        </div>
      </div>
    </div>
  );
}
