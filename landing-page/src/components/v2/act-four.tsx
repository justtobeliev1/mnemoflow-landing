"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Guides } from "./hero";
import { EASE, Rise } from "./ui";

/**
 * 第四幕 · 排期（第 3 天 → 第 30 天）
 * 访客给自己评级，下面的一个月立刻重排：复习点落在哪几天、间隔怎么越拉越长、记忆曲线怎么一次比一次掉得慢。
 * 具体哪几天是示意——真实间隔由 FSRS 按每个人的记录算。
 */

const DAYS = 30;
// 每种评级之后，这个月里大致会在哪几天再见到它（示意）
const PLANS = [
  { key: "again", label: "忘记", hint: "完全没印象", days: [0, 1, 3, 8, 19] },
  { key: "hard", label: "困难", hint: "想了很久", days: [1, 4, 11, 25] },
  { key: "good", label: "良好", hint: "想一下就有", days: [3, 11, 28] },
  { key: "easy", label: "简单", hint: "脱口而出", days: [7, 27] },
];

// 图的坐标
const VW = 1000;
const X0 = 14;
const X1 = 986;
const dayX = (d: number) => X0 + (d / DAYS) * (X1 - X0);
const FULL = 20; // 曲线的顶端
const LOW = 128; // 每一段掉到这个高度时，正好是下一次复习
const STRIP = 190; // 日历条

/**
 * 把一个月切成几段：每段从"满格"开始往下掉，掉到"快忘了"那条线时正好是下一次复习。
 * 段越靠后跨度越长，所以同样的落差掉得越慢。最后一段到月底还没掉到线。
 */
function segments(days: number[]) {
  const starts = days[0] === 0 ? days : [0, ...days];
  return starts.map((from, i) => {
    const next = starts[i + 1];
    const xa = dayX(from);
    if (next !== undefined) {
      const xb = dayX(next);
      const w = xb - xa;
      return { xa, xb, yb: LOW, d: `M ${xa} ${FULL} C ${xa + w * 0.22} ${FULL + (LOW - FULL) * 0.6}, ${xa + w * 0.6} ${LOW - 5}, ${xb} ${LOW}`, open: false };
    }
    // 最后一段：按"比上一段再长一倍多"来估它掉得多慢，只画到月底
    const prevGap = i > 0 ? from - starts[i - 1] : 3;
    const t = Math.min(1, (DAYS - from) / Math.max(prevGap * 2.2, 4));
    const yb = FULL + (LOW - FULL) * (1 - Math.pow(1 - t, 1.7));
    const w = X1 - xa;
    return { xa, xb: X1, yb, d: `M ${xa} ${FULL} C ${xa + w * 0.3} ${FULL + (yb - FULL) * 0.6}, ${xa + w * 0.7} ${yb - 3}, ${X1} ${yb}`, open: true };
  });
}

export function ActFour() {
  const [pick, setPick] = useState(2);
  const plan = PLANS[pick];
  const segs = useMemo(() => segments(plan.days), [plan]);

  return (
    <section id="act-4" className="relative overflow-hidden bg-mist py-28 lg:py-36">
      <Guides />
      <div className="wrap relative">
        <div className="grid items-end gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <Rise delay={0.05}>
              <h2 className="head text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.12]">
                刚才那一下，
                <br />
                你觉得有多轻松？
              </h2>
            </Rise>
            <Rise delay={0.1}>
              <p className="mt-6 max-w-[27em] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.75] text-navy-soft">
                给自己评个级就行，剩下的交给 FSRS 算法。它会算出你大概什么时候忘，赶在那之前让你再看一眼。越熟，隔得越久。
              </p>
            </Rise>
          </div>

          <Rise delay={0.15}>
            <div className="glass p-5 sm:p-6">
              <div className="text-[12px] font-medium tracking-[0.08em] text-white/45">请为您的记忆评级</div>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PLANS.map((it, i) => (
                  <button
                    key={it.key}
                    type="button"
                    aria-pressed={i === pick}
                    onClick={() => setPick(i)}
                    className={cn(
                      "relative rounded-2xl px-3 py-3.5 text-center transition-colors duration-300",
                      i === pick ? "text-white" : "well text-white/65 hover:text-white",
                    )}
                  >
                    {i === pick && (
                      <motion.span
                        layoutId="a4-pick"
                        className="absolute inset-0 rounded-2xl bg-flow shadow-[0_12px_30px_-10px_rgb(var(--g2)/0.9),inset_0_1px_0_rgb(255_255_255/0.4)]"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    )}
                    <span className="relative block text-[16px] font-semibold">{it.label}</span>
                    <span className="relative mt-1 block text-[12px] opacity-70">{it.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </Rise>
        </div>

        {/* 这个月的安排 */}
        <Rise delay={0.2} className="mt-12 lg:mt-16">
          <div className="glass glass-light px-5 pb-7 pt-6 sm:px-9 sm:pb-9 sm:pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="text-[15px] font-semibold">
                评「{plan.label}」之后的一个月
                <span className="ml-3 font-normal text-navy-soft">还会复习 {plan.days.length} 次</span>
              </p>
              <span className="rounded-full bg-navy/[0.06] px-2.5 py-1 text-[11px] text-navy-faint">示意 · 实际间隔由 FSRS 按你的记录计算</span>
            </div>

            <svg viewBox={`0 0 ${VW} 236`} className="mt-7 w-full overflow-visible" aria-label="评级之后一个月内的复习安排示意图">
              <defs>
                <linearGradient id="a4-stroke" gradientUnits="userSpaceOnUse" x1={X0} x2={X1} y1="0" y2="0">
                  <stop offset="0" stopColor="rgb(var(--g1))" />
                  <stop offset="0.5" stopColor="rgb(var(--g2))" />
                  <stop offset="1" stopColor="rgb(var(--g3))" />
                </linearGradient>
                <linearGradient id="a4-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.16" />
                  <stop offset="1" stopColor="rgb(var(--g2))" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 一段一段的记忆曲线：每复习一次回到顶端，之后掉得比上一段慢 */}
              {segs.map((g, i) => (
                <g key={`${plan.key}-${i}`}>
                  <motion.path
                    d={`${g.d} L ${g.xb} ${LOW + 18} L ${g.xa} ${LOW + 18} Z`}
                    fill="url(#a4-fill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.28 }}
                  />
                  <motion.path
                    d={g.d}
                    fill="none"
                    stroke="url(#a4-stroke)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.28 }}
                  />
                </g>
              ))}

              {/* 复习点 */}
              {plan.days.map((day, i) => (
                <motion.g
                  key={`${plan.key}-r${day}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18, delay: (plan.days[0] === 0 ? 0.1 : 0.7) + i * 0.28 }}
                  style={{ transformOrigin: `${dayX(day)}px ${FULL}px`, transformBox: "view-box" } as never}
                >
                  <circle cx={dayX(day)} cy={FULL} r="12" fill="rgb(var(--g2) / 0.2)" />
                  <circle cx={dayX(day)} cy={FULL} r="5" fill="#fff" stroke="rgb(var(--g2))" strokeWidth="2.5" />
                </motion.g>
              ))}

              {/* 日历条：一天一个小点，复习那天亮起来 */}
              {Array.from({ length: DAYS + 1 }, (_, day) => {
                const on = plan.days.includes(day);
                return (
                  <circle
                    key={day}
                    cx={dayX(day)}
                    cy={STRIP}
                    r={on ? 6 : 2.25}
                    fill={on ? "url(#a4-stroke)" : "rgb(var(--ink) / 0.16)"}
                    style={{ transition: "r .4s cubic-bezier(.22,1,.36,1), fill .4s" }}
                  />
                );
              })}

              <text x={X0} y={STRIP + 30} fontSize="13" fill="rgb(var(--ink-faint))">今天</text>
              <text x={X1} y={STRIP + 30} fontSize="13" textAnchor="end" fill="rgb(var(--ink-faint))">一个月后</text>
            </svg>
          </div>
        </Rise>
      </div>
    </section>
  );
}
