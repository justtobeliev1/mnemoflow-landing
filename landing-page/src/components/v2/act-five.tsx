"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Guides } from "./hero";
import { EASE, Rise } from "./ui";

/**
 * 第五幕 · 追问
 * 一个真的能点的问答面板：三个预设问题（措辞取自应用里的预设），点了就流式吐出回答。
 * 这里的回答是预先写好的演示文本；应用里由模型实时生成。
 */

const QA = [
  {
    q: "造一个例句，并给出中文解释",
    a: "She is the quintessential New Yorker: fast-talking, impatient, and always in a hurry.\n她是典型的纽约人：语速快、没耐心、永远行色匆匆。",
  },
  {
    q: "它的近义词有哪些？有什么细微差别？",
    a: "typical 只是「常见、有代表性」；classic 强调「公认的范例」；quintessential 分量最重，指把某类事物的本质体现到了极致，多见于书面语。",
  },
  {
    q: "常见搭配有哪些？请给例句",
    a: "最常见的是 the quintessential + 名词：the quintessential gentleman（绅士的典范）、the quintessential English village（最地道的英国村庄）。",
  },
];

type Msg = { role: "user" | "ai"; text: string };

export function ActFive() {
  const [log, setLog] = useState<Msg[]>([]);
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState<{ full: string; n: number } | null>(null);
  const [waiting, setWaiting] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [log, typing?.n, waiting]);

  // 逐字输出
  useEffect(() => {
    if (!typing) return;
    if (typing.n >= typing.full.length) {
      setLog((l) => [...l, { role: "ai", text: typing.full }]);
      setTyping(null);
      return;
    }
    const id = window.setTimeout(() => setTyping((t) => (t ? { ...t, n: t.n + 2 } : t)), 28);
    return () => clearTimeout(id);
  }, [typing]);

  const ask = (i: number) => {
    if (typing || waiting || asked.includes(i)) return;
    setAsked((a) => [...a, i]);
    setLog((l) => [...l, { role: "user", text: QA[i].q }]);
    setWaiting(true);
    timers.current.push(
      window.setTimeout(() => {
        setWaiting(false);
        setTyping({ full: QA[i].a, n: 0 });
      }, 900),
    );
  };

  const busy = !!typing || waiting;
  const left = QA.map((_, i) => i).filter((i) => !asked.includes(i));

  return (
    <section id="act-5" className="relative overflow-hidden bg-white py-28 lg:py-36">
      <Guides />
      {/* 面板背后的一团天色，让玻璃有东西可透 */}
      <div aria-hidden className="pointer-events-none absolute left-[-8%] top-[18%] h-[62%] w-[58%] rounded-full bg-flow opacity-[0.22] blur-[120px]" />

      <div className="wrap relative grid items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <Rise className="order-2 lg:order-1">
          <div className="glass mx-auto flex h-[520px] max-w-[520px] flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 shadow-[inset_0_-1px_0_rgb(255_255_255/0.08)]">
              <span className="flex items-center gap-2.5 text-[15px] font-semibold">
                <span className="h-2 w-2 rounded-full bg-flow" />
                AI问答小栈 — quintessential
              </span>
              <span className="text-white/35">×</span>
            </div>

            <div ref={body} className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5 text-[14.5px] leading-[1.7]" data-lenis-prevent>
              <div className="well max-w-[88%] !rounded-2xl !rounded-bl-md px-4 py-2.5 text-white/85">
                你好！我是你的英语学习助手。关于单词 &quot;quintessential&quot;，有什么可以帮你吗？
              </div>

              <AnimatePresence initial={false}>
                {log.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={
                      m.role === "user"
                        ? "max-w-[88%] self-end rounded-2xl rounded-br-md bg-white px-4 py-2.5 font-medium text-coal shadow-[0_8px_24px_-10px_rgb(255_255_255/0.5)]"
                        : "well max-w-[92%] whitespace-pre-line !rounded-2xl !rounded-bl-md px-4 py-2.5 text-white/85"
                    }
                  >
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              {waiting && (
                <div className="well flex w-fit gap-1.5 !rounded-2xl !rounded-bl-md px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
              {typing && (
                <div className="well max-w-[92%] whitespace-pre-line !rounded-2xl !rounded-bl-md px-4 py-2.5 text-white/85">
                  {typing.full.slice(0, typing.n)}
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-white/70" />
                </div>
              )}
            </div>

            <div className="px-6 pb-5 pt-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
              {left.length > 0 ? (
                <>
                  <div className="text-[12px] text-white/40">试试这些问题：</div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {left.map((i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={busy}
                        onClick={() => ask(i)}
                        className="well !rounded-full px-3.5 py-2 text-left text-[13px] text-white/85 transition-all duration-300 hover:bg-white/[0.12] disabled:opacity-40"
                      >
                        {QA[i].q}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="well !rounded-xl px-4 py-2.5 text-[13.5px] text-white/35">输入你的问题...</div>
              )}
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-[520px] text-center text-[12px] text-navy-faint">
            这里的回答是预先写好的演示；在应用里由模型实时生成，对话按单词保存
          </p>
        </Rise>

        <div className="order-1 lg:order-2">
          <Rise delay={0.05}>
            <h2 className="head text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.12]">
              学到一半，
              <br />
              冒出个问题
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-6 max-w-[26em] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.75] text-navy-soft">
              它和 typical 有什么区别？能用来夸人吗？直接问就行，不用切出去查。AI 就在这个词旁边，问完接着学。
            </p>
          </Rise>
          <Rise delay={0.15}>
            <p className="mt-8 flex items-center gap-3 text-[15px] font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-flow text-white">←</span>
              点一个问题试试
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
