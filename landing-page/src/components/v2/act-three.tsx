"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Guides } from "./hero";
import { EASE, Rise } from "./ui";

/**
 * 第三幕 · 唤回（第 1 天）
 * 页面真的出一道题，访客自己点。选错不判错：那一项变灰，卡片亮出助记蓝图，再选一次。
 * 这就是产品里"有点模糊，进入测试"那条路径。
 */

const OPTIONS = ["必不可少的", "精髓的；典范的", "第五个的", "古怪的"];
const CORRECT = 1;

export function ActThree() {
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const hinted = wrong.length > 0;

  const pick = (i: number) => {
    if (done || wrong.includes(i)) return;
    if (i === CORRECT) {
      setDone(true);
      return;
    }
    setWrong((w) => [...w, i]);
    setShake(i);
    window.setTimeout(() => setShake(null), 450);
  };
  const reset = () => {
    setWrong([]);
    setDone(false);
  };

  const status = done
    ? hinted
      ? { t: "对了", s: "不是蒙的，是你自己想起来的，这样才记得住" }
      : { t: "一次就对", s: "看来那杯茶没白倒" }
    : hinted
      ? { t: "没关系，这不算错", s: "给你个提示，再想一次" }
      : { t: "第二天，它回来考你", s: "别往回翻，凭印象选一个" };

  return (
    <section id="act-3" className="relative overflow-hidden bg-white py-28 lg:py-0">
      <Guides />
      <div className="wrap relative grid items-center gap-x-10 gap-y-14 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div>
          <div className="relative min-h-[13.5rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={status.t}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <h2 className="head text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.12]">{status.t}</h2>
                <p className="mt-6 max-w-[24em] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.75] text-navy-soft">{status.s}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Rise delay={0.1}>
            <p className="mt-2 max-w-[30em] border-l-2 border-navy/10 pl-4 text-[14px] leading-[1.8] text-navy-faint">
              Mnemoflow 的复习不急着打叉。第一次选错，它先给提示，让你自己把答案想出来。自己想起来的，比别人告诉你的记得牢。
            </p>
          </Rise>
        </div>

        <Rise delay={0.15} className="relative">
          {/* 答对时从卡片背后涌出来的一团渐变 */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-10 rounded-[40%] bg-flow blur-[70px]"
            initial={false}
            animate={done ? { opacity: [0, 0.75, 0.38], scale: [0.7, 1.15, 1] } : { opacity: 0.16, scale: 0.9 }}
            transition={{ duration: 1.2, ease: EASE }}
          />

          <div className="glass relative mx-auto max-w-[480px] p-7 sm:p-8">
            <div className="flex items-center justify-between text-[12px] font-medium tracking-[0.08em] text-white/45">
              <span>复习</span>
              <span>{done ? "已想起" : "选出它的意思"}</span>
            </div>
            <div className="word mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)] leading-none tracking-[-0.03em]">quintessential</div>
            <div className="mt-2 text-[13px] text-white/40">/ˌkwɪntɪˈsenʃl/ · adj.</div>

            <AnimatePresence initial={false}>
              {hinted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="well mt-5 px-4 py-3.5">
                    <div className="text-[11px] font-medium tracking-[0.1em] text-white/45">线索 · 助记蓝图</div>
                    <div className="mt-2 text-[15px] leading-[1.9]">
                      <span className="hl-flow font-semibold">女王的 (Queen’s)</span>{" "}
                      <span className="hl-flow font-semibold">必要 (essential)</span> 品质
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 grid gap-2.5">
              {OPTIONS.map((opt, i) => {
                const isWrong = wrong.includes(i);
                const isRight = done && i === CORRECT;
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => pick(i)}
                    disabled={isWrong || done}
                    animate={shake === i ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={!isWrong && !done ? { scale: 1.015 } : undefined}
                    whileTap={!isWrong && !done ? { scale: 0.985 } : undefined}
                    className={cn(
                      "relative rounded-2xl px-5 py-3.5 text-left text-[16px] transition-colors duration-300",
                      isRight
                        ? "bg-flow font-semibold text-white shadow-[0_14px_36px_-10px_rgb(var(--g2)/0.9),inset_0_1px_0_rgb(255_255_255/0.4)]"
                        : isWrong
                          ? "cursor-default text-white/25 line-through shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)]"
                          : "well text-white/90 hover:bg-white/[0.1]",
                      done && !isRight && !isWrong && "opacity-40",
                    )}
                  >
                    <span className="mr-3.5 inline-grid h-6 w-6 place-items-center rounded-[7px] bg-white/10 align-[-1px] text-[11px] font-semibold text-current opacity-80 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]">
                      {"ABCD"[i]}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex h-6 items-center justify-between text-[13px] text-white/45">
              <span>{done ? "这就是一次主动回想" : hinted ? "再想一次" : "点一个选项"}</span>
              {(done || hinted) && (
                <button type="button" onClick={reset} className="rounded-full px-3 py-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                  重来一次
                </button>
              )}
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
