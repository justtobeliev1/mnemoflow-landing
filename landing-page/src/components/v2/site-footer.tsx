"use client";

/**
 * 页尾，也是整页的收场：终场答完题，下面一块大色板从白边里长出来。
 * 色板用的是首屏那条光带的四个颜色，但不是把光带搬过来——是一片铺开的、慢慢流动的天色；
 * 左上角竖排三个大字链接，贴纸散在右边和中间，底部是一笔写成的巨型手写体 mnemoflow，下半截沉进色板的底边，上面"啪"地贴着几张贴纸。
 *
 * 结构和玩法借自 Sticker Slap Footer，按这个页面重写：
 *   · 滚进来时色板从边框里长出来，链接从遮罩下升起；
 *     大字在最底下，所以等它自己滚进视野才开始写（f 的那一横最后补），笔尖经过哪里，哪里的贴纸就拍下来；
 *   · 之后它是个玩具：贴纸可以拖（会跟着甩的方向歪一下，松手"啪"地贴回去），双击送回原位；
 *     点一下大字，再写一遍；
 *   · 颜色全部取自当前天色，换天色时整块跟着变；
 *   · 窄屏上大字本身就小，贴纸整体往上提一截（--up），只压住字的上沿，不把字盖住；
 *   · 贴纸是和这个产品有关的东西：女王的王冠、那杯茶、"aha"、灯泡、打了勾的日历、"hi!"。
 *
 * 手写体是一套单线字母：每个字母的主笔画从 (0,-1) 起、到 (字宽,-1) 止，所以能首尾相接连成一笔。
 * 这里只收了用得到的几个字母。
 */

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { APP_URL } from "./data";
import { softBlob } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;
const GITHUB = "https://github.com/justtobeliev1/mnemoflow";

/* ───────────────────────── 手写体 ───────────────────────── */

// [字宽, 主笔画, 提笔后补的笔画, 写完这个字母要不要提笔]。x 高 10，基线 0，y 向下。
const SCRIPT: Record<string, [number, string, string?, number?]> = {
  a: [10.2, "M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -0.8 8.8 -1 10.2 -1"],
  e: [9.4, "M0 -1C3.4 -2.4 8 -4.4 8 -7.6C8 -9.4 6.6 -10.4 4.8 -10.4C2.2 -10.4 0.8 -7.8 0.8 -5C0.8 -1.8 2.6 0 5 0C6.8 0 8 -1 9.4 -1"],
  f: [7, "M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 7.2C1.8 9.6 3.2 9.6 3.8 7.6C4.4 5 4.8 -1 7 -1", "M-0.4 -9.4L5.4 -9.4"],
  h: [10, "M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -1L1.8 -5.6C2.6 -8.6 4 -10 5.6 -10C7.2 -10 7.8 -8.8 7.8 -7L7.8 -3C7.8 -0.8 8.8 -1 10 -1"],
  i: [5, "M0 -1C1.2 -1.4 2 -6 2.2 -10L2.2 -3C2.2 -0.8 3.4 -1 5 -1", "M2.4 -15.2L2.5 -15.3"],
  l: [6.4, "M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -3.2C1.8 -0.6 4 -1 6.4 -1"],
  m: [14.6, "M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.4 -8.6 3.4 -10 4.8 -10C6.2 -10 7 -9 7 -7L7 -1L7 -5.6C7.6 -8.6 8.6 -10 10 -10C11.4 -10 12.2 -9 12.2 -7L12.2 -3C12.2 -0.8 13.2 -1 14.6 -1"],
  n: [9.6, "M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.4 -8.6 3.4 -10 4.8 -10C6.4 -10 7.2 -9 7.2 -7L7.2 -3C7.2 -0.8 8.2 -1 9.6 -1"],
  o: [9, "M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5C7.6 -7.8 6.1 -10 4.3 -10C6 -10 7.4 -9.2 9 -9", "", 1],
  w: [12.6, "M0 -1C1.2 -1.6 1.6 -6 1.6 -9.6L1.6 -3.6C1.6 -1 2.6 0 4 0C5.4 0 6.2 -1 6.2 -3.6L6.2 -8L6.2 -3.6C6.2 -1 7 0 8.4 0C9.8 0 10.8 -1 10.8 -3.6L10.8 -9.6C11.2 -9 11.8 -8.8 12.6 -8.8", "", 1],
  "!": [4, "M2 -16L2 -4.4", "M2 -0.6L2.1 -0.7", 1],
};
const SX = 1.22; // 横向拉宽
const TRACK = 1; // 字母之间的空
const STROKE = 3.3;
const SLANT = 0.1584; // 字往右倾 9°
const r2 = (v: number) => Math.round(v * 100) / 100;

/** 把一条只含 M/L/C 的路径里所有 x 坐标平移并拉宽（x、y 交替出现） */
const shift = (d: string, dx: number) => {
  let k = 0;
  return d.replace(/-?\d*\.?\d+/g, (n) => (k++ % 2 === 0 ? String(r2(+n * SX + dx)) : n));
};

/**
 * 把一个词排成手写体：几段不提笔的连笔（strokes），加上最后回头补的几笔（extra）。
 * 连笔要分开成几条 path——虚线图案在每个子路径上都会从头算，塞进一条 path 里，几段会同时开始写。
 */
function writeScript(text: string) {
  let x = 0, lift = true, top = 0, bottom = 0;
  const strokes: { d: string; from: number; to: number }[] = [];
  const extra: string[] = [];
  for (const ch of text.toLowerCase()) {
    const g = SCRIPT[ch];
    if (!g) { x += 6; lift = true; continue; }
    const d = shift(g[1], x);
    if (lift) strokes.push({ d, from: x, to: x });
    else strokes[strokes.length - 1].d += "L" + d.slice(1);
    strokes[strokes.length - 1].to = x + g[0] * SX;
    if (g[2]) extra.push(shift(g[2], x));
    const ys = ((g[1] + (g[2] ?? "")).match(/-?\d*\.?\d+/g) ?? []).map(Number).filter((_, i) => i % 2 === 1);
    top = Math.min(top, ...ys);
    bottom = Math.max(bottom, ...ys);
    lift = !!g[3];
    x += g[0] * SX + TRACK;
  }
  return { strokes, extra, all: strokes.map((k) => k.d).join("") + extra.join(""), width: r2(x - TRACK), top, bottom };
}

/** 贴纸上的小字：同一套手写体，缩放到指定宽度 */
function ScriptText({ text, cx, cy, w, color }: { text: string; cx: number; cy: number; w: number; color: string }) {
  const { all, width, top } = useMemo(() => writeScript(text), [text]);
  const s = w / (width + STROKE);
  const h = (-top + 1) * s;
  return (
    <g transform={`translate(${r2(cx - (width * s) / 2)} ${r2(cy + h / 2 - s)}) scale(${r2(s)})`}>
      <path d={all} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/* ───────────────────────── 贴纸 ───────────────────────── */

const INK = "rgb(var(--ink))";
const G1 = "rgb(var(--g1))", G2 = "rgb(var(--g2))", G3 = "rgb(var(--g3))", G4 = "rgb(var(--g4))";

/** 一个参差的星芒：手剪出来的那种 */
const burst = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 - Math.PI / 2;
    const jag = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const r = i % 2 ? 39 : 54 * (1 + ((jag - Math.floor(jag)) - 0.5) * 0.2);
    pts.push(`${r2(60 + Math.cos(a) * r)} ${r2(60 + Math.sin(a) * r)}`);
  }
  return `M${pts.join("L")}Z`;
})();
const BUBBLE = "M24 22H96A14 14 0 0 1 110 36V70A14 14 0 0 1 96 84H56L34 102L38 84H24A14 14 0 0 1 10 70V36A14 14 0 0 1 24 22Z";
const CROWN = "M16 92L12 42L38 62L60 26L82 62L108 42L104 92Z";
const BULB = "M60 12C38 12 24 28 24 48C24 62 32 70 40 78L42 90H78L80 78C88 70 96 62 96 48C96 28 82 12 60 12Z";

/** 每张贴纸：shape 是外轮廓（用来压一圈白边），art 是上面的图。画布 120×120 */
const STICKERS: { label: string; shape: ReactNode; art: ReactNode; x: number; y: number; size: number; rotate: number; depth: number }[] = [
  {
    label: "aha 贴纸",
    x: 7.3, y: 30.5, size: 11.6, rotate: -12, depth: 0.9,
    shape: <path d={burst} />,
    art: (
      <>
        <path d={burst} fill={G4} />
        <ScriptText text="aha" cx={60} cy={60} w={58} color={INK} />
      </>
    ),
  },
  {
    label: "王冠贴纸",
    x: 45.6, y: 23.5, size: 11, rotate: 10, depth: 0.6,
    shape: (
      <>
        <path d={CROWN} />
        <circle cx="12" cy="40" r="8" />
        <circle cx="60" cy="24" r="8" />
        <circle cx="108" cy="40" r="8" />
      </>
    ),
    art: (
      <>
        <path d={CROWN} fill={G4} />
        <path d="M16 92L15 78H105L104 92Z" fill={G3} />
        <circle cx="12" cy="40" r="8" fill={G3} />
        <circle cx="60" cy="24" r="8" fill={G1} />
        <circle cx="108" cy="40" r="8" fill={G3} />
        <circle cx="38" cy="85" r="4" fill="#fff" />
        <circle cx="60" cy="85" r="4" fill="#fff" />
        <circle cx="82" cy="85" r="4" fill="#fff" />
      </>
    ),
  },
  {
    label: "一杯茶贴纸",
    x: 27.5, y: -2.5, size: 11.2, rotate: -8, depth: 1.1,
    shape: (
      <>
        <path d="M22 46H86V66C86 86 72 96 54 96C36 96 22 86 22 66Z" />
        <path d="M86 52C104 50 106 76 84 76" fill="none" strokeWidth="19" />
        <ellipse cx="56" cy="104" rx="46" ry="8" />
      </>
    ),
    art: (
      <>
        <ellipse cx="56" cy="104" rx="46" ry="8" fill={G2} />
        <path d="M86 52C104 50 106 76 84 76" fill="none" stroke={G1} strokeWidth="8" strokeLinecap="round" />
        <path d="M22 46H86V66C86 86 72 96 54 96C36 96 22 86 22 66Z" fill={G1} />
        <ellipse cx="54" cy="46" rx="32" ry="7" fill={G4} />
        <path d="M42 34C38 28 46 24 42 16M60 34C56 28 64 24 60 14" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
        <path d="M32 58V70" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </>
    ),
  },
  {
    label: "灯泡贴纸",
    x: 60.8, y: -3, size: 10.4, rotate: 12, depth: 0.5,
    shape: (
      <>
        <path d={BULB} />
        <rect x="42" y="86" width="36" height="24" rx="8" />
      </>
    ),
    art: (
      <>
        <path d={BULB} fill={G4} />
        <rect x="42" y="86" width="36" height="24" rx="8" fill={INK} />
        <path d="M46 96H74M48 104H72" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M48 56L56 68L64 56L72 68" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <path d="M38 36Q42 24 54 22" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
      </>
    ),
  },
  {
    label: "打了勾的日历贴纸",
    x: 76, y: -61, size: 11.6, rotate: -10, depth: 1,
    shape: <rect x="14" y="20" width="92" height="88" rx="16" />,
    art: (
      <>
        <rect x="14" y="20" width="92" height="88" rx="16" fill="#fff" />
        <path d="M14 36A16 16 0 0 1 30 20H90A16 16 0 0 1 106 36V46H14Z" fill={G2} />
        <path d="M38 14V30M82 14V30" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M40 76L54 90L82 60" fill="none" stroke={G1} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "hi! 贴纸",
    x: 91.5, y: 2, size: 12.2, rotate: 8, depth: 0.7,
    shape: <path d={BUBBLE} />,
    art: (
      <>
        <path d={BUBBLE} fill={G1} />
        <ScriptText text="hi!" cx={60} cy={53} w={44} color="#fff" />
      </>
    ),
  },
];

function StickerArt({ shape, art, id }: { shape: ReactNode; art: ReactNode; id: string }) {
  return (
    <svg viewBox="-6 -6 132 132" className="block h-auto w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <clipPath id={`${id}-c`}>{shape}</clipPath>
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 外面一圈白边，像模切出来的贴纸 */}
      <g fill="#fff" stroke="#fff" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round">
        {shape}
      </g>
      {art}
      {/* 鼠标移上去时扫过的一道反光 */}
      <g clipPath={`url(#${id}-c)`}>
        <g transform="rotate(20 60 60)">
          <rect className="sf-sheen" x="-30" y="-30" width="180" height="180" fill={`url(#${id}-g)`} />
        </g>
      </g>
    </svg>
  );
}

/* ───────────────────────── 页尾 ───────────────────────── */

const LINKS = [
  { text: "打开应用", href: APP_URL, mark: "↗" },
  { text: "GitHub", href: GITHUB, mark: "↗" },
  { text: "回到顶部", href: "#top", mark: "↑" },
];

const WORD = writeScript("mnemoflow");
const PAD = STROKE / 2 + 0.6;
const VB = { x: -1.4 - PAD, y: WORD.top - PAD, w: WORD.width + 2.8 + PAD * 2 - WORD.top * SLANT, h: WORD.bottom + PAD - (WORD.top - PAD) };
const CUT = -1.2 - VB.y; // 色板的底边切在基线下面一点：字的下半截沉进去
const WRITE_AT = 0.15, WRITE_FOR = 2.4, PEN_UP = 0.07;
// 每段连笔写多久、从什么时候开始：按它占的宽度分时间，两段之间留一下提笔的空
const INKED = WORD.strokes.reduce((s, k) => s + k.to - k.from, 0);
const PLAN = WORD.strokes.reduce<{ at: number; dur: number }[]>((plan, k, i) => {
  const prev = plan[i - 1];
  plan.push({ at: prev ? prev.at + prev.dur + PEN_UP : 0, dur: (WRITE_FOR * (k.to - k.from)) / INKED });
  return plan;
}, []);
const WRITE_END = PLAN[PLAN.length - 1].at + PLAN[PLAN.length - 1].dur;
/** 笔尖写到横向 x（0–100）这个位置是第几秒 */
const penAt = (x: number) => {
  const u = (x / 100) * WORD.width;
  const i = Math.max(0, WORD.strokes.findIndex((k) => u <= k.to));
  const k = WORD.strokes[i];
  return PLAN[i].at + PLAN[i].dur * Math.min(1, Math.max(0, (u - k.from) / (k.to - k.from)));
};

type Drag = { i: number; id: number; sx: number; sy: number; px: number; py: number; lx: number; t: number; tilt: number; w: number; h: number; went: boolean };

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(root, { once: true, amount: 0.22 });
  const live = useInView(root); // 不在视野里时，底色停止流动
  const inked = useInView(stage, { once: true, amount: 0.4 }); // 大字露出一小半，才开始写
  const [run, setRun] = useState(0); // 点大字重写一遍
  const [moved, setMoved] = useState<Record<number, { x: number; y: number }>>({});
  const [order, setOrder] = useState<number[]>([]);
  const drag = useRef<Drag | null>(null);

  // 色板随滚动从边框里长出来
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [72, 22]);

  const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wiggle = (el: Element | null, frames: Keyframe[], duration: number) => {
    if (!reduce()) (el as HTMLElement | null)?.animate?.(frames, { duration, easing: "cubic-bezier(.3,1.4,.4,1)" });
  };
  const SLAP: Keyframe[] = [{ transform: "scale(1.14)" }, { transform: "scale(.93,1.04)", offset: 0.4 }, { transform: "scale(1.02,.98)", offset: 0.7 }, { transform: "none" }];
  const SHAKE: Keyframe[] = [{ transform: "none" }, { transform: "rotate(-14deg) scale(1.1)", offset: 0.3 }, { transform: "rotate(9deg)", offset: 0.6 }, { transform: "none" }];
  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i]);

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    if (e.button !== 0 || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const at = moved[i] ?? STICKERS[i];
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, id: e.pointerId, sx: at.x, sy: at.y, px: e.clientX, py: e.clientY, lx: e.clientX, t: performance.now(), tilt: 0, w: r.width, h: r.height, went: false };
    raise(i);
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    if (!d.went && Math.hypot(dx, dy) < 4) return;
    const host = e.currentTarget.parentElement;
    if (!host) return;
    if (!d.went) host.classList.add("is-drag");
    d.went = true;
    host.style.left = Math.min(99, Math.max(1, d.sx + (dx / d.w) * 100)) + "%";
    host.style.top = Math.min(96, Math.max(-130, d.sy + (dy / d.h) * 100)) + "%";
    // 跟着甩的方向歪一下：取水平速度，稍微平滑
    const now = performance.now();
    const v = (e.clientX - d.lx) / Math.max(1, now - d.t);
    d.tilt = d.tilt * 0.75 + Math.min(24, Math.max(-24, v * 22)) * 0.25;
    d.lx = e.clientX;
    d.t = now;
    host.style.setProperty("--tilt", d.tilt.toFixed(2) + "deg");
  };
  const onUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const host = e.currentTarget.parentElement;
    host?.classList.remove("is-drag");
    host?.style.setProperty("--tilt", "0deg");
    const lift = e.currentTarget.querySelector(".sf-lift");
    if (d.went && host) {
      setMoved((m) => ({ ...m, [d.i]: { x: parseFloat(host.style.left), y: parseFloat(host.style.top) } }));
      wiggle(lift, SLAP, 420);
    } else wiggle(lift, SHAKE, 520);
  };
  const goHome = (i: number, btn: HTMLElement) => {
    setMoved((m) => {
      const next = { ...m };
      delete next[i];
      return next;
    });
    wiggle(btn.querySelector(".sf-lift"), SLAP, 420);
  };
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.shiftKey ? 6 : 2;
    const go: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const at = moved[i] ?? STICKERS[i];
    if (go[e.key]) {
      e.preventDefault();
      raise(i);
      setMoved((m) => ({ ...m, [i]: { x: Math.min(99, Math.max(1, at.x + go[e.key][0])), y: Math.min(96, Math.max(-130, at.y + go[e.key][1])) } }));
    } else if (e.key === "Home" || e.key === "Escape") {
      e.preventDefault();
      goHome(i, e.currentTarget);
    }
  };
  const replay = () => {
    setMoved({});
    setRun((r) => r + 1);
  };

  // 鼠标位置：贴纸有一点点视差，底色上有一团光跟着走
  const onPointer = (e: React.PointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const external = (href: string) => (/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <footer ref={root} data-live={live ? "" : undefined} className="sf relative overflow-clip bg-white px-2 pb-2 sm:px-3 sm:pb-3" onPointerMove={onPointer}>
      <style>{CSS}</style>

      <motion.div style={{ scale, borderRadius: radius }} className="relative flex min-h-[52svh] origin-bottom flex-col overflow-clip text-white sm:min-h-[70svh]">
        {/* 底色：光带的四个颜色铺成一片，三团颜色各自慢慢漂 */}
        <div aria-hidden className="sf-sky absolute inset-0">
          <i className="sf-blob sf-blob-a" />
          <i className="sf-blob sf-blob-b" />
          <i className="sf-blob sf-blob-c" />
          <i className="sf-glow" />
        </div>

        {/* 三个链接，竖着排 */}
        <ul className="relative z-[2] self-start px-5 pt-8 text-[clamp(1.75rem,3.5vw,3.25rem)] font-extrabold leading-[1.22] tracking-[-0.028em] sm:px-8 sm:pt-11 lg:px-11 lg:pt-12">
          {LINKS.map((l, i) => (
            <li key={l.text} className="overflow-hidden pb-[0.08em]">
              <motion.a
                href={l.href}
                className="sf-link inline-block"
                initial={{ y: "115%" }}
                animate={seen ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.08 }}
                {...external(l.href)}
              >
                {l.text}
                <span className="sf-mark ml-[0.18em] inline-block font-semibold opacity-70">{l.mark}</span>
              </motion.a>
            </li>
          ))}
        </ul>

        {/* 大字和贴纸 */}
        <div className="relative z-[1] mt-auto w-full px-2 pt-[min(20vw,12rem)] sm:px-3">
          <div ref={stage} className="relative [container-type:inline-size]" style={{ marginBottom: `${r2(-((VB.h - CUT) / VB.w) * 100)}%` }}>
            <button type="button" onClick={replay} aria-label="再写一遍 Mnemoflow" className="block w-full cursor-pointer [-webkit-tap-highlight-color:transparent]">
              <svg key={run} viewBox={[VB.x, VB.y, VB.w, VB.h].map(r2).join(" ")} className="block h-auto w-full overflow-visible text-white" aria-hidden>
                <g transform="skewX(-9)" fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
                  {WORD.strokes.map((k, i) => (
                    <motion.path
                      key={i}
                      d={k.d}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={inked ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ pathLength: { duration: PLAN[i].dur, ease: [0.4, 0.05, 0.45, 1], delay: WRITE_AT + PLAN[i].at }, opacity: { duration: 0.01, delay: WRITE_AT + PLAN[i].at } }}
                    />
                  ))}
                  {WORD.extra.map((d, k) => (
                    <motion.path
                      key={k}
                      d={d}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={inked ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ pathLength: { duration: 0.28, delay: WRITE_AT + WRITE_END + 0.1 + k * 0.16 }, opacity: { duration: 0.01, delay: WRITE_AT + WRITE_END + 0.1 + k * 0.16 } }}
                    />
                  ))}
                </g>
              </svg>
            </button>

            {STICKERS.map((s, i) => {
              const at = moved[i] ?? s;
              // 笔尖写到它下面的那一刻，它拍下来
              const delay = WRITE_AT + penAt(s.x) + 0.05;
              return (
                <div
                  key={i}
                  className="sf-st absolute select-none [touch-action:none]"
                  style={{ left: `${at.x}%`, top: `${at.y}%`, width: `max(${s.size}cqw, 42px)`, zIndex: 3 + Math.max(0, order.indexOf(i) + 1), "--r": `${s.rotate}deg`, "--d": s.depth } as CSSProperties}
                >
                  <button
                    type="button"
                    className="sf-st-btn block w-full cursor-grab"
                    aria-label={`${s.label}。可以拖动，也可以用方向键移动；按 Esc 送回原位。`}
                    onPointerDown={(e) => onDown(e, i)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onDoubleClick={(e) => goHome(i, e.currentTarget)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    <motion.span
                      key={run}
                      className="block"
                      initial={{ opacity: 0, scale: 2.1, rotate: 24, y: "-30%" }}
                      animate={inked ? { opacity: 1, scale: [2.1, 0.9, 1.05, 1], rotate: [24, -3, 1, 0], y: "0%" } : {}}
                      transition={{
                        default: { duration: 0.6, times: [0, 0.5, 0.76, 1], ease: "easeOut", delay },
                        opacity: { duration: 0.16, delay },
                        y: { duration: 0.3, ease: "easeIn", delay },
                      }}
                    >
                      <span className="sf-lift block">
                        <StickerArt shape={s.shape} art={s.art} id={`sf-s${i}`} />
                      </span>
                    </motion.span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <p className="pt-2.5 text-center text-[12px] text-navy-faint sm:pt-3">© 2026 Mnemoflow 赋流</p>
    </footer>
  );
}

// 底色、贴纸的旋转/悬停/拖拽靠 CSS 变量和类名切换，写成一段样式更直接
const CSS = `
.sf-sky{background:linear-gradient(104deg,rgb(var(--g1)) 0%,rgb(var(--g2)) 46%,rgb(var(--g3)) 100%)}
.sf-blob,.sf-glow{position:absolute;border-radius:50%;aspect-ratio:1;animation:12s ease-in-out infinite alternate paused}
.sf[data-live] .sf-blob{animation-play-state:running}
.sf-blob-a{width:72%;right:-20%;top:-64%;background:${softBlob("var(--g4)")};animation-name:sf-drift-a;animation-duration:17s}
.sf-blob-b{width:70%;left:-22%;bottom:-70%;background:${softBlob("var(--g1)")};animation-name:sf-drift-b;animation-duration:21s}
.sf-blob-c{width:52%;left:34%;top:8%;background:${softBlob("var(--g2)", 0.9)};animation-name:sf-drift-c;animation-duration:25s}
.sf-glow{width:46%;left:27%;top:50%;margin-top:-23%;background:${softBlob("255 255 255", 0.2)};animation:none;transform:translate(calc(var(--px,0) * 105%),calc(var(--py,0) * 60%));transition:transform 1.1s cubic-bezier(.2,.8,.2,1)}
@keyframes sf-drift-a{from{transform:translate(0,0) scale(1)}to{transform:translate(-24%,22%) scale(1.25)}}
@keyframes sf-drift-b{from{transform:translate(0,0) scale(1)}to{transform:translate(30%,-18%) scale(1.15)}}
@keyframes sf-drift-c{from{transform:translate(-30%,10%) scale(.9)}to{transform:translate(34%,-6%) scale(1.2)}}
.sf-link{position:relative}
.sf-link::after{content:"";position:absolute;left:0;right:0;bottom:-.02em;height:.09em;border-radius:1em;background:currentColor;transform:scaleX(0);transform-origin:100% 50%;transition:transform .45s cubic-bezier(.6,0,.2,1)}
.sf-link:hover::after,.sf-link:focus-visible::after{transform:scaleX(1);transform-origin:0 50%}
.sf-mark{transition:transform .4s cubic-bezier(.2,1.5,.3,1)}
.sf-link:hover .sf-mark{transform:translate(.12em,-.12em)}
.sf-st{translate:-50% calc(-50% - var(--up,0px));transform:translate(calc(var(--px,0) * var(--d) * 9px),calc(var(--py,0) * var(--d) * 6px));transition:transform .7s cubic-bezier(.2,.8,.2,1)}
.sf-st.is-drag{z-index:9 !important;transition:none}
.sf-st-btn{rotate:calc(var(--r) + var(--tilt,0deg));transition:rotate .5s cubic-bezier(.2,1.4,.3,1)}
.sf-st.is-drag .sf-st-btn{cursor:grabbing;transition:rotate .12s linear}
.sf-lift{transition:transform .35s cubic-bezier(.2,1.5,.3,1),filter .35s;filter:drop-shadow(0 1px .5px rgb(var(--ink) / .28)) drop-shadow(0 4px 6px rgb(var(--ink) / .18))}
.sf-st-btn:hover .sf-lift,.sf-st-btn:focus-visible .sf-lift{transform:translateY(-4%) scale(1.06);filter:drop-shadow(0 2px 1px rgb(var(--ink) / .2)) drop-shadow(0 14px 16px rgb(var(--ink) / .3))}
.sf-st.is-drag .sf-lift{transform:translateY(-7%) scale(1.12);filter:drop-shadow(0 2px 1px rgb(var(--ink) / .16)) drop-shadow(0 22px 22px rgb(var(--ink) / .34))}
.sf-sheen{transform:translateX(-130%);transition:transform 0s}
.sf-st-btn:hover .sf-sheen{transform:translateX(130%);transition:transform .9s cubic-bezier(.4,0,.2,1)}
@media (max-width:640px){.sf{--up:9cqw}.sf-blob-a{width:560px;right:-300px;top:-200px}.sf-blob-b{width:560px;left:-300px;bottom:-340px}.sf-blob-c{width:440px;left:-10%;top:26%}}
@media (hover:none){.sf-glow{display:none}}
@media (prefers-reduced-motion: reduce){.sf-st{transform:none}.sf-blob{animation:none}}
`;
