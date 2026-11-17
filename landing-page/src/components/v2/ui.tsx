"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 钉住的舞台底部的旁白：进度落在 [from, to] 之间时显示。
 * 只做淡入和位移，不做模糊：给大字号文字加模糊滤镜很贵，第一次触发时会让滚动明显卡一下。
 */
export function ScrubCaption({
  p,
  from,
  to,
  title,
  sub,
  dark = false,
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  const first = from <= 0;
  const opacity = useTransform(
    p,
    first ? [0, to - 0.015, to + 0.015] : [from - 0.02, from + 0.015, to - 0.015, to + 0.015],
    first ? [1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(p, first ? [0, to + 0.015] : [from - 0.02, from + 0.015, to + 0.015], first ? [0, -10] : [14, 0, -10]);
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-end" style={{ opacity, y }}>
      <p className={cn("head text-[clamp(1.4rem,2.7vw,2.3rem)] leading-[1.3] [text-wrap:balance]", dark && "text-white")}>{title}</p>
      {sub && <p className={cn("mt-2.5 text-[clamp(0.95rem,1.25vw,1.15rem)] tracking-[0.01em]", dark ? "text-white/55" : "text-navy-soft")}>{sub}</p>}
    </motion.div>
  );
}

/** 章节大标题：一行一行从遮罩下升起 */
export function Lines({ lines, className, delay = 0 }: { lines: React.ReactNode[]; className?: string; delay?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        // 触发器放在外层遮罩上：内层一开始被完全裁掉，自己观察不到"进入视口"
        <motion.span
          key={i}
          className={cn("block overflow-hidden pb-[0.1em]", className)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -14% 0px" }}
        >
          <motion.span
            className="block"
            variants={{ hidden: { y: "108%" }, show: { y: 0 } }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}

/** 普通（不钉住）章节里的标题块，滚到眼前时升起 */
export function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 一团颜色（CSS 径向渐变）：透明度按缓出曲线降到 0，边缘看不出圆的轮廓。
 * c 是 RGB 三元组或 var(--g1) 这样的变量，a 是中心的不透明度。
 */
export const softBlob = (c: string, a = 1) =>
  `radial-gradient(closest-side,${[1, 0.86, 0.62, 0.38, 0.19, 0.07, 0]
    .map((k, i) => `rgb(${c} / ${Math.round(k * a * 100) / 100}) ${Math.round((i / 6) * 100)}%`)
    .join(",")})`;
