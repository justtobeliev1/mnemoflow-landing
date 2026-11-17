"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SKIES, applySky, loadSky, saveSky, type Sky } from "./theme";

/**
 * 天色：把配色做成"一天里的七个时刻"，导航栏上是一小摞叠着的色球。
 *   · 平时只露三颗：最前面是现在的天色，后面压着接下来的两个时刻；
 *   · 鼠标移上去（或者键盘聚焦、手机上点一下），七颗沿一道日弧散开——破晓在左，正午最高，月光在右；
 *   · 点哪颗，整页就换成那时的天色。球下面的小字是这个时刻的名字；
 *   · 散开后是光溜溜的色球，没有描边，现在这颗比别的大一号。
 * 宽屏上散开时把左边的导航项推开；窄屏放不下，就往左盖出去，底下垫一块白底。
 */

const N = SKIES.length;
const BALL = 20; // 散开时球的直径
const GAP = 7;
const SMALL = 0.8; // 叠着时缩小一点
const PEEK = 7; // 叠着时后面每颗露出来多少
const SHOWN = 3;
const H = 32;
const STACK_W = BALL * SMALL + (SHOWN - 1) * PEEK;
const SPREAD_W = N * BALL + (N - 1) * GAP;
const SPRING = { type: "spring" as const, stiffness: 320, damping: 26 };

const sun = (s: Sky) => `linear-gradient(135deg, ${s.flow[0]}, ${s.flow[1]} 40%, ${s.flow[2]} 75%, ${s.flow[3]})`;
/** 散开时的日弧：中间（正午）最高，两头落下去 */
const arc = (i: number) => {
  const t = (i - (N - 1) / 2) / ((N - 1) / 2);
  return t * t * 6 - 3;
};
const spreadX = (i: number) => i * (BALL + GAP);

export function SkyDial() {
  const [open, setOpen] = useState(false);
  const [sky, setSky] = useState<Sky>(SKIES[0]);
  const [peek, setPeek] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const switching = useRef(false); // 整页正在交叉淡化
  const reduced = useReducedMotion();

  // 读回上次的选择
  useEffect(() => {
    const saved = loadSky();
    setSky(saved);
    applySky(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // 触屏上没有"移开"：点别处或按 Esc 收起来
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (s: Sky) => {
    if (s.id === sky.id) return;
    setSky(s);
    saveSky(s);
    // 淡化期间页面被快照盖住，会收到一次假的"鼠标移开"：先不理，等淡化完再看鼠标是不是真的还在上面
    switching.current = true;
    applySky(s, true).then(() => {
      switching.current = false;
      const el = root.current;
      if (el && !el.matches(":hover") && !el.contains(document.activeElement)) setOpen(false);
    });
  };

  const cur = SKIES.indexOf(sky);
  const label = SKIES[peek ?? cur];
  const labelAt = spreadX(peek ?? cur) + BALL / 2;

  return (
    <motion.div
      ref={root}
      role="radiogroup"
      aria-label="天色"
      className="relative shrink-0"
      style={{ height: H }}
      initial={false}
      animate={{ width: open && !narrow ? SPREAD_W : STACK_W }}
      transition={SPRING}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse" || switching.current) return;
        setOpen(false);
        setPeek(null);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <motion.div
        className={cn("absolute right-0 top-0 transition-opacity duration-300", open ? "opacity-100" : "opacity-75")}
        style={{ height: H }}
        initial={false}
        animate={{ width: open ? SPREAD_W : STACK_W }}
        transition={SPRING}
      >
        {/* 窄屏散开时会盖到左边的东西上：垫一块白底 */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-x-3 -inset-y-1.5 rounded-full bg-white/90 shadow-[0_8px_24px_-8px_rgb(var(--ink)/0.3),0_0_0_1px_rgb(var(--ink)/0.06)] backdrop-blur-md transition-opacity duration-300",
            open && narrow ? "opacity-100" : "opacity-0",
          )}
        />

        {SKIES.map((s, i) => {
          const on = i === cur;
          const rank = (i - cur + N) % N; // 叠着时的前后次序：0 是现在的天色，在最前面
          const hidden = !open && rank >= SHOWN;
          return (
            <motion.button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${s.name} ${s.clock}`}
              tabIndex={open || on ? 0 : -1}
              // 叠着的时候点它是"展开"，散开之后点它才是"选这个"
              onClick={() => (open ? pick(s) : setOpen(true))}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPeek(i)}
              onPointerLeave={() => !switching.current && setPeek(null)}
              onFocus={() => setPeek(i)}
              onBlur={() => setPeek(null)}
              className={cn("absolute left-0 grid place-items-center rounded-full outline-offset-2", hidden && "pointer-events-none")}
              style={{ width: BALL, height: BALL, top: (H - BALL) / 2, zIndex: open ? (peek === i ? N + 2 : on ? N + 1 : 1) : N - rank }}
              initial={false}
              animate={{
                x: open ? spreadX(i) : Math.min(rank, SHOWN - 1) * PEEK - (BALL * (1 - SMALL)) / 2,
                y: open && !reduced ? arc(i) + (peek === i ? -2 : 0) : 0,
                // 散开后没有描边了，现在这颗靠大一号来认
                scale: open ? (peek === i ? 1.3 : on ? 1.2 : 1) : hidden ? 0.5 : SMALL,
                opacity: hidden ? 0 : 1,
              }}
              transition={{ ...SPRING, delay: open && !reduced ? Math.abs(i - cur) * 0.018 : 0 }}
            >
              <span
                className={cn(
                  "block h-full w-full rounded-full transition-shadow duration-300",
                  // 叠着时每颗有一圈白边，才分得清前后；散开后就是光溜溜的色球，白边褪掉
                  open ? "shadow-[0_0_0_0px_#fff,0_3px_8px_-1px_rgb(var(--ink)/0.3)]" : "shadow-[0_0_0_2px_#fff,0_2px_6px_rgb(var(--ink)/0.28)]",
                )}
                style={{ background: sun(s) }}
              />
            </motion.button>
          );
        })}

        {/* 球下面的小字：鼠标指着哪颗说哪颗，没指就说现在这颗 */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-full"
          initial={false}
          animate={{ x: labelAt, opacity: open ? 1 : 0, y: open ? 6 : 0 }}
          transition={SPRING}
        >
          <span className="block -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-[5px] text-[12px] font-semibold leading-none text-navy shadow-[0_6px_18px_-6px_rgb(var(--ink)/0.35),0_0_0_1px_rgb(var(--ink)/0.06)]">
            {label.name}
            <span className="ml-1.5 font-medium tabular-nums text-navy-faint">{label.clock}</span>
          </span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
