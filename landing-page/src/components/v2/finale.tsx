"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { APP_URL } from "./data";
import { Guides } from "./hero";
import { EASE, Rise, softBlob } from "./ui";

/**
 * 终场：兑现首屏那句话。再问一次 quintessential 是什么意思——这一次没有任何提示在屏幕上。
 * 答对之后才说"你记住了"；但"开始使用"的按钮一直都在，不拿答题卡转化。
 *
 * 画面：白底上，这个词本身是主角——整页最大的一行字，用天色的四个颜色当墨水，慢慢流；
 * 选项和按钮背后有一团光晕（同样四个颜色），随滚动亮起来；答对时从正确选项迸出一把彩屑。
 */

const OPTIONS = ["短暂的", "迥然不同的", "精髓的；典范的", "无处不在的"];
const CORRECT = 2;

// 答对时的彩屑：从正确选项迸出去。位置、大小用序号算出来，每次都一样（不用随机数，免得水合对不上）
const BITS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.4;
  const far = 150 + ((i * 53) % 150);
  return { x: Math.cos(a) * far * 1.5, y: Math.sin(a) * far * 0.85 - 50, turn: ((i * 97) % 360) - 180, size: 9 + ((i * 5) % 9), round: i % 3 === 0, color: `rgb(var(--g${(i % 4) + 1}))`, delay: (i % 5) * 0.018 };
});

export function Finale() {
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLElement>(null);
  const live = useInView(root);
  // 光晕随滚动亮起来
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "center center"] });
  const glow = useTransform(scrollYProgress, [0.15, 1], [0, 1]);
  const swell = useTransform(scrollYProgress, [0, 1], [0.72, 1]);

  const pick = (i: number) => {
    if (done || wrong.includes(i)) return;
    if (i === CORRECT) setDone(true);
    else setWrong((w) => [...w, i]);
  };

  return (
    <section ref={root} id="finale" data-live={live ? "" : undefined} className="fin relative overflow-hidden bg-white">
      <style>{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[60%] aspect-[1.5/1] w-[max(132%,820px)] sm:aspect-[2.3/1] max-w-[1700px] -translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ opacity: glow, scale: swell }} className="fin-halo absolute inset-0">
          <i className="fin-b fin-b1" />
          <i className="fin-b fin-b2" />
          <i className="fin-b fin-b3" />
          <i className="fin-b fin-b4" />
        </motion.div>
      </div>
      <Guides />

      <div className="wrap relative flex min-h-[92svh] flex-col items-center justify-center pb-24 pt-32 text-center">
        <div className="relative min-h-[9.5rem] w-full sm:min-h-[12.5rem] lg:min-h-[14rem]">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="q" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5, ease: EASE }}>
                <h2 className="head text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.1]">还记得它吗？</h2>
                <p className="word fin-word mt-1 text-[clamp(2.7rem,9vw,8rem)] leading-[1.12] tracking-[-0.045em] sm:mt-2">quintessential</p>
              </motion.div>
            ) : (
              <motion.div key="a" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE }}>
                <h2 className="head text-[clamp(2.3rem,5.6vw,5rem)] leading-[1.1]">你记住了</h2>
                <p className="mx-auto mt-5 max-w-[26em] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.7] text-navy-soft">
                  从头到尾，你一遍都没背
                  <br />
                  剩下的几千个词，也可以这样记
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Rise delay={0.1} className="mt-6 w-full max-w-[640px]">
          <div className="relative grid grid-cols-2 gap-3">
            {done && (
              <span aria-hidden className="pointer-events-none absolute left-1/4 top-3/4 z-10">
                {BITS.map((b, i) => (
                  <motion.i
                    key={i}
                    className="absolute block"
                    style={{ width: b.size, height: b.round ? b.size : b.size * 0.5, borderRadius: b.round ? "50%" : 2, background: b.color }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                    animate={{ x: b.x, y: [0, b.y, b.y + 90], opacity: [1, 1, 0], scale: 1, rotate: b.turn }}
                    transition={{ duration: 1.25, ease: [0.16, 0.8, 0.3, 1], delay: b.delay, y: { duration: 1.25, times: [0, 0.45, 1], ease: ["easeOut", "easeIn"], delay: b.delay }, opacity: { duration: 1.25, times: [0, 0.6, 1], delay: b.delay } }}
                  />
                ))}
              </span>
            )}
            {OPTIONS.map((opt, i) => {
              const isWrong = wrong.includes(i);
              const isRight = done && i === CORRECT;
              return (
                <motion.button
                  key={opt}
                  type="button"
                  disabled={isWrong || done}
                  onClick={() => pick(i)}
                  whileHover={!isWrong && !done ? { y: -3 } : undefined}
                  whileTap={!isWrong && !done ? { scale: 0.98 } : undefined}
                  className={cn(
                    "px-4 py-4 text-[clamp(1rem,1.5vw,1.2rem)] font-semibold transition-opacity duration-300",
                    isRight
                      ? "rounded-[22px] bg-flow text-white shadow-[0_18px_44px_-12px_rgb(var(--g2)/0.9),inset_0_1px_0_rgb(255_255_255/0.45)]"
                      : "glass glass-light",
                    isWrong && "opacity-35 line-through",
                    done && !isRight && "opacity-35",
                  )}
                >
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="mt-4 h-6 text-[14px] text-navy-soft">
            {done ? "" : wrong.length > 0 ? "提示：想想那杯茶" : "这一次没有提示"}
          </p>
        </Rise>

        <Rise delay={0.2} className="mt-8 flex flex-col items-center gap-4">
          <a href={APP_URL} className="pill pill-navy h-14 px-8 text-[17px]">
            开始使用 Mnemoflow <span className="chev">→</span>
          </a>
        </Rise>
      </div>
    </section>
  );
}

const ink = (g: string) => `color-mix(in srgb, rgb(var(--${g})) 84%, rgb(var(--ink)))`; // 往墨色里压一点，白底上才立得住
const CSS = `
.fin-word{padding-bottom:.1em;color:transparent;background:linear-gradient(100deg,${ink("g1")} 0%,${ink("g2")} 26%,${ink("g3")} 50%,${ink("g4")} 68%,${ink("g1")} 100%) 0 0/220% 100%;-webkit-background-clip:text;background-clip:text;animation:fin-ink 11s ease-in-out infinite alternate paused}
@keyframes fin-ink{to{background-position:100% 0}}
.fin-halo{-webkit-mask-image:radial-gradient(closest-side,#000 0%,rgb(0 0 0 / .7) 40%,rgb(0 0 0 / .25) 72%,transparent 100%);mask-image:radial-gradient(closest-side,#000 0%,rgb(0 0 0 / .7) 40%,rgb(0 0 0 / .25) 72%,transparent 100%)}
.fin-b{position:absolute;width:50%;aspect-ratio:1;border-radius:50%;animation:14s ease-in-out infinite alternate paused}
.fin[data-live] .fin-b,.fin[data-live] .fin-word{animation-play-state:running}
.fin-b1{left:0%;top:-12%;background:${softBlob("var(--g1)", 0.6)};animation-name:fin-d1;animation-duration:17s}
.fin-b2{left:17%;top:-30%;background:${softBlob("var(--g2)", 0.7)};animation-name:fin-d2;animation-duration:21s}
.fin-b3{left:33%;top:0%;background:${softBlob("var(--g3)", 0.62)};animation-name:fin-d1;animation-duration:23s;animation-direction:alternate-reverse}
.fin-b4{left:50%;top:-18%;background:${softBlob("var(--g4)", 0.58)};animation-name:fin-d2;animation-duration:19s;animation-direction:alternate-reverse}
@keyframes fin-d1{from{transform:translate(-9%,4%) scale(.95)}to{transform:translate(12%,-8%) scale(1.12)}}
@keyframes fin-d2{from{transform:translate(8%,-5%) scale(1.08)}to{transform:translate(-12%,9%) scale(.94)}}
@media (prefers-reduced-motion: reduce){.fin-b,.fin-word{animation:none}}
`;
