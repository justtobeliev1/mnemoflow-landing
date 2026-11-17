"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { APP_URL } from "./data";
import { SkyDial } from "./sky-dial";

/**
 * 图标「扇」：九张词卡绕着同一个点旋开，越往前越大、越不透明。
 * 颜色跟着天色走：从最后面那张到最前面那张，沿着当前天色的四个色标过去（破晓时是橙 → 粉 → 紫 → 蓝紫）。
 * 标签页图标和主屏图标是固定的图片（src/app/icon.svg、apple-icon.png），形状和这里是同一套参数，
 * 出自仓库根目录的 brand/make-fan.py。
 */
const FAN_STOPS = ["--g4", "--g3", "--g2", "--brand"];
const FAN = Array.from({ length: 9 }, (_, k) => {
  const t = k / 8;
  const u = t * (FAN_STOPS.length - 1);
  const i = Math.min(Math.floor(u), FAN_STOPS.length - 2);
  const sc = 0.5 + 0.5 * t;
  return {
    angle: -128 + t * 196,
    w: 112 * sc,
    h: 252 * sc,
    r: 32 * sc,
    opacity: 0.3 + 0.7 * t ** 1.5,
    color: `color-mix(in srgb, rgb(var(${FAN_STOPS[i + 1]})) ${Math.round((u - i) * 100)}%, rgb(var(${FAN_STOPS[i]})))`,
  };
});

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="-172.7 -234.2 437 342.3" className={className} aria-hidden>
      {FAN.map((c, k) => (
        <rect
          key={k}
          x={-c.w / 2}
          y={-c.h - 4}
          width={c.w}
          height={c.h}
          rx={c.r}
          transform={`rotate(${c.angle.toFixed(1)})`}
          style={{ fill: c.color }}
          fillOpacity={c.opacity}
          stroke="#fff"
          strokeOpacity={0.35 + 0.5 * (k / 8)}
          strokeWidth={2}
        />
      ))}
      <circle r="10" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.02em]", className)}>
      <Mark className="h-[27px] w-auto shrink-0" />
      Mnemoflow
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const darks = Array.from(document.querySelectorAll<HTMLElement>("[data-dark]"));
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // 页眉只在页面顶上出现：离开顶部就收起来，往回滚也不再冒出来挡内容，回到顶上才回来
      setHidden(window.scrollY > 80);
      // 导航条压在深色段落上时换成深色
      setDark(darks.some((el) => { const r = el.getBoundingClientRect(); return r.top <= 34 && r.bottom >= 34; }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,transform,opacity] duration-500 ease-out",
        hidden && "pointer-events-none -translate-y-full opacity-0",
        dark
          ? "bg-[#080a12]/75 text-white shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl"
          : scrolled && "bg-white/80 shadow-[0_1px_0_rgb(var(--ink)/0.08)] backdrop-blur-xl",
      )}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <a href="#top" aria-label="Mnemoflow 首页">
          <Logo />
        </a>
        <nav className="flex items-center gap-4 text-[15px] font-semibold sm:gap-6">
          <a href="#sea" className="hidden opacity-80 transition-opacity hover:opacity-100 sm:block">
            试一个词
          </a>
          <SkyDial />
          <a href={APP_URL} className={cn("pill h-9 px-4 text-[14px]", dark ? "bg-white text-[#080a12] hover:bg-white/85" : "pill-navy")}>
            开始使用 <span className="chev">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
