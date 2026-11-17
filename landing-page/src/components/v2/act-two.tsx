"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Guides } from "./hero";
import { ScrubCaption } from "./ui";

/**
 * 第二幕 · 遗忘（20 分钟后）
 * 刚学会的单词一个字母一个字母地褪色、下沉，下面的记忆曲线同步往下掉；
 * 最后字母几乎看不见了，但两块联想还亮着——那是留下来的线索。
 */

const WORD = "quintessential";
// 曲线图的坐标
const X0 = 40, X1 = 840, TOP = 24, BASE = 226, END_Y = 208;
const CURVE = `M ${X0} ${TOP} C 125 142, 265 192, ${X1} ${END_Y}`;

// 字母褪色的先后（打乱，不是从左到右）
const ORDER = [5, 11, 2, 8, 0, 13, 6, 3, 10, 1, 12, 7, 4, 9];

export function ActTwo() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  const meaningOpacity = useTransform(p, [0.14, 0.4], [1, 0]);
  const meaningBlur = useTransform(p, [0.14, 0.4], ["blur(0px)", "blur(10px)"]);
  const draw = useTransform(p, [0.1, 0.56], [0, 1]);
  const anchors = useTransform(p, [0.62, 0.74], [0, 1]);
  const anchorsY = useTransform(p, [0.62, 0.74], [16, 0]);

  // 沿曲线走的小圆点
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  useMotionValueEvent(draw, "change", (v) => {
    const el = path.current;
    if (!el || !dot.current) return;
    const pt = el.getPointAtLength(el.getTotalLength() * v);
    dot.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);

  });

  return (
    <section id="act-2" ref={track} className="relative h-[330svh] bg-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Guides />

        <div className="absolute inset-x-0 top-[19%] flex flex-col items-center px-6">
          <div className="word flex text-[clamp(2.2rem,8.4vw,7.6rem)] leading-none tracking-[-0.035em]">
            {WORD.split("").map((ch, i) => (
              <Fading key={i} p={p} rank={ORDER[i]}>
                {ch}
              </Fading>
            ))}
          </div>

          <div className="relative mt-5 h-12 w-full">
            <motion.p
              style={{ opacity: meaningOpacity, filter: meaningBlur }}
              className="head absolute inset-0 text-center text-[clamp(1.3rem,2.6vw,2.2rem)]"
            >
              精髓的；典范的
            </motion.p>
            {/* 字母淡了，线索还在 */}
            <motion.div style={{ opacity: anchors, y: anchorsY }} className="absolute inset-0 flex items-center justify-center gap-3">
              {["Queen’s 女王的", "essential 必要的"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-flow px-4 py-2 text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold text-white shadow-[0_10px_30px_-8px_rgb(var(--g2)/0.8),inset_0_1px_0_rgb(255_255_255/0.4)]"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 记忆曲线（示意）：只留一条线、一片淡淡的色、一个点、一根底轴 */}
        <div className="absolute inset-x-0 top-[46%] flex justify-center px-6">
          <div className="relative w-full max-w-[860px]">
            <svg viewBox="0 0 880 268" className="w-full overflow-visible" aria-label="记忆随时间下降的示意曲线">
              <defs>
                <linearGradient id="a2-stroke" gradientUnits="userSpaceOnUse" x1={X0} x2={X1} y1="0" y2="0">
                  <stop offset="0" stopColor="rgb(var(--g1))" />
                  <stop offset="0.55" stopColor="rgb(var(--g2))" />
                  <stop offset="1" stopColor="rgb(var(--g3))" />
                </linearGradient>
                <linearGradient id="a2-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.16" />
                  <stop offset="1" stopColor="rgb(var(--g2))" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgb(var(--ink) / 0.12)" />
              <motion.path d={`${CURVE} L ${X1} ${BASE} L ${X0} ${BASE} Z`} fill="url(#a2-fill)" style={{ opacity: draw }} />
              <motion.path ref={path} d={CURVE} fill="none" stroke="url(#a2-stroke)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: draw }} />

              <g ref={dot} transform={`translate(${X0} ${TOP})`}>
                <circle r="12" fill="rgb(var(--g2) / 0.2)" />
                <circle r="5" fill="#fff" stroke="rgb(var(--g2))" strokeWidth="2.5" />
              </g>

              <text x={X0} y={BASE + 26} fontSize="13" fill="rgb(var(--ink-faint))">
                刚学完
              </text>
              <text x={X1} y={BASE + 26} fontSize="13" textAnchor="end" fill="rgb(var(--ink-faint))">
                20 分钟后
              </text>
            </svg>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[7svh] px-6 text-center">
          <div className="relative mx-auto h-[5.5rem] max-w-[44rem]">
            <ScrubCaption p={p} from={0} to={0.1} title="然后你去做了别的事" sub="20 分钟过去了" />
            <ScrubCaption p={p} from={0.14} to={0.56} title="它开始褪色" sub="很正常，谁的大脑都这样" />
            <ScrubCaption p={p} from={0.64} to={1.1} title="字母淡了，线索还在" sub="明天就靠它了" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Fading({ p, rank, children }: { p: MotionValue<number>; rank: number; children: React.ReactNode }) {
  const a = 0.12 + rank * 0.022;
  const opacity = useTransform(p, [a, a + 0.2], [1, 0.1]);
  const y = useTransform(p, [a, a + 0.26], [0, 22 + (rank % 5) * 9]);
  const filter = useTransform(p, [a, a + 0.2], ["blur(0px)", "blur(7px)"]);
  const rotate = useTransform(p, [a, a + 0.26], [0, (rank % 2 ? 1 : -1) * (4 + (rank % 4) * 3)]);
  return (
    <motion.span className="inline-block" style={{ opacity, y, filter, rotate }}>
      {children}
    </motion.span>
  );
}
