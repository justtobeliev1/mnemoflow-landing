"use client";

/**
 * 词牌挂杆：十张竖长的词牌用小钩子挂在一根横杆上。
 *
 * 思路和很多细节借自 Skate Deck Rail（一排竖长的东西侧身挂着、带摆动、悬停转正、点开看详情），按这个页面重写：
 *   · 挂的是词牌：正面一幅插画，单词竖排在上面；
 *   · 鼠标划过会带起一阵"风"，牌像风铃一样摆。摆动是一个弹簧-阻尼模型，相邻的牌之间还连着一点，
 *     所以拨动一张，晃动会像波一样往两边传；钩子只跟着转三成，牌自己再绕挂孔转七成，看起来是两节的；
 *   · 鼠标停在哪张上，哪张就转正、往前提，两边的牌让开一点。转正的过程里：
 *       侧身时压在牌面上的那层暗影褪掉，一道高光从左到右扫过牌面，
 *       墙上的影子从"贴着墙的窄影"换成"离墙更远、更大更虚的影子"；
 *   · 钩子上还挂着一张小纸签，自己有一点惯性，比牌慢半拍；
 *   · 没人碰的时候每隔几秒自动转正一张，一有交互就停；
 *   · 点开：牌放大到左边，右边把这个词拆给你看（拆法 → 一句话 → 词义 → 记忆场景）；
 *   · 窄屏上横杆放不下十张侧身的牌，改成一排可以横向滑动的正面牌，滑动时牌跟着晃。
 *
 * 每帧直接写 DOM 的 transform，不触发 React 重渲染。
 */

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ART } from "./art";
import { CardFace } from "./art/card-face";
import { MNEMONICS, type Mnemonic, type Part } from "./mnemonics";
import { EASE } from "./ui";

// 挂出来的顺序：深浅相间。主角 quintessential 不挂。
const ORDER = ["ephemeral", "mortgage", "candid", "meticulous", "ponder", "scrutiny", "bargain", "resilient", "disparate", "equivalent"];
const ITEMS: Mnemonic[] = ORDER.map((w) => MNEMONICS.find((m) => m.word === w)!).filter(Boolean);
const N = ITEMS.length;

const RAIL_Y = 24; // 横杆中线离舞台顶边
const RAIL_T = 9; // 横杆粗细
const HOOK = 34; // 横杆中线到牌顶
const EDGE = 26;
const HANG_SHARE = 0.3; // 摆角里由钩子承担的那一份
const PERSPECTIVE = 1900; // 视距拉远一点：近边和远边的高度差小，不像广角镜头那样夸张
const SWING_MAX = 4.5; // 摆角上限（度）：牌是厚纸板，沉，晃不大
// 牌的厚度：正面后面一层层叠着同样形状的纸板（每层往后 1px），侧身时右边露出一道纸边
const SLAB = Array.from({ length: 9 }, (_, k) => k + 1);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** 每张牌静止时侧身的角度，略有参差 */
const rest = (i: number) => -53 + (((i * 37) % 7) - 3) * 0.9;

type Sim = {
  x: number[]; vx: number[];
  turn: number[]; vturn: number[];
  lift: number[]; vlift: number[];
  swing: number[]; vswing: number[];
  tag: number[]; vtag: number[];
};
const zeros = () => ITEMS.map(() => 0);

/** 金属钩：上面一个弯扣在横杆上，一根直杆垂下来，末端一个小弯钩进牌顶的孔 */
function Hook({ height }: { height: number }) {
  const h = height + 14;
  const shank = `M 17 14 C 17 20, 11 20, 11 27 L 11 ${h - 7}`;
  const curl = `M 5 15 C 5 3, 17 3, 17 14`;
  const tip = `M 11 ${h - 7} Q 11 ${h - 1}, 6.5 ${h - 2}`;
  return (
    <svg aria-hidden width="22" height={h} viewBox={`0 0 22 ${h}`} className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 overflow-visible" style={{ top: -12 }}>
      <g fill="none" strokeLinecap="round">
        <path d={`${curl} ${shank} ${tip}`} stroke="rgb(var(--ink) / 0.25)" strokeWidth="3.4" transform="translate(1.2 1.6)" />
        <path d={`${curl} ${shank} ${tip}`} stroke="rgb(var(--ink) / 0.82)" strokeWidth="2.6" />
        {/* 一道细细的高光，让它像金属 */}
        <path d={`${curl} ${shank}`} stroke="#fff" strokeOpacity="0.65" strokeWidth="0.8" transform="translate(-0.55 -0.3)" />
      </g>
    </svg>
  );
}

export function WordRail() {
  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const hangs = useRef<(HTMLDivElement | null)[]>([]);
  const swings = useRef<(HTMLDivElement | null)[]>([]);
  const turns = useRef<(HTMLButtonElement | null)[]>([]);
  const shades = useRef<(HTMLSpanElement | null)[]>([]);
  const glints = useRef<(HTMLSpanElement | null)[]>([]);
  const nears = useRef<(HTMLSpanElement | null)[]>([]);
  const fars = useRef<(HTMLSpanElement | null)[]>([]);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);

  const [size, setSize] = useState({ W: 0, cw: 150, mode: "rail" as "rail" | "strip" });
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  // 模拟循环要读的"实时"状态，不走 React
  const live = useRef({ active: null as number | null, open: null as number | null, touched: false, visible: false, size });
  live.current.size = size;
  live.current.open = open;
  const sim = useRef<Sim | null>(null);

  const face = (i: number | null) => {
    live.current.active = i;
    setActive(i);
  };

  /* 量尺寸：够宽就挂成一排侧身的牌，不够宽就改成横向滑动 */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const W = el.clientWidth;
      const mode = W >= 880 ? "rail" : "strip";
      const cardH = mode === "rail" ? clamp(W * 0.39, 330, 460) : clamp(window.innerHeight * 0.44, 300, 380);
      setSize({ W, cw: Math.round(cardH * 0.375), mode });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 物理循环 */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const centre = (i: number) => {
      const { W } = live.current.size;
      return EDGE + ((W - EDGE * 2) / N) * (i + 0.5);
    };
    const s: Sim = sim.current ?? {
      x: ITEMS.map((_, i) => centre(i)), vx: zeros(),
      turn: ITEMS.map((_, i) => rest(i)), vturn: zeros(),
      lift: zeros(), vlift: zeros(),
      swing: zeros(), vswing: zeros(),
      tag: zeros(), vtag: zeros(),
    };
    sim.current = s;

    const step = (dt: number) => {
      const { cw, mode } = live.current.size;
      const a = live.current.open === null ? live.current.active : null;
      for (let i = 0; i < N; i++) {
        let ax = 0;
        if (mode === "rail") {
          // 目标位置：有牌转正时，两边的牌各让开一点，越远让得越少，让出来的空由一整排牌分摊。
          // 两边让得不一样多：单词竖排在每张牌的左下角。右边那张要整个让出来，不然它的单词会被转正的牌盖住；
          // 左边那张被压住的是右半边，不碍事，少让一点，左边一排也就不用挤。
          const d = a === null ? 0 : i - a;
          const push = d > 0 ? cw * 0.31 * Math.pow(0.78, d - 1) : d < 0 ? -cw * 0.2 * Math.pow(0.72, -d - 1) : 0;
          // 版面刚量出来或窗口大改时，牌的位置离目标很远：直接摆过去，别让它们甩着冲过来
          if (Math.abs(centre(i) - s.x[i]) > cw * 1.6) { s.x[i] = centre(i) + push; s.vx[i] = 0; }
          ax = 150 * (centre(i) + push - s.x[i]) - 20 * s.vx[i];
          s.vx[i] += ax * dt;
          s.x[i] += s.vx[i] * dt;
          const at = 130 * ((a === i ? 0 : rest(i)) - s.turn[i]) - 18 * s.vturn[i];
          s.vturn[i] += at * dt;
          s.turn[i] += s.vturn[i] * dt;
          const al = 130 * ((a === i ? 1 : 0) - s.lift[i]) - 19 * s.vlift[i];
          s.vlift[i] += al * dt;
          s.lift[i] += s.vlift[i] * dt;
        }
        // 摆动：挂在钩子上的阻尼摆。被横向推开时（ax）会被带着晃；左右邻居之间连着一点，晃动会传开
        const left = s.swing[i - 1] ?? s.swing[i], right = s.swing[i + 1] ?? s.swing[i];
        const as = -22 * s.swing[i] - 3.2 * s.vswing[i] - ax * 0.011 + 5 * (left + right - 2 * s.swing[i]);
        s.vswing[i] += as * dt;
        s.swing[i] = clamp(s.swing[i] + s.vswing[i] * dt, -SWING_MAX, SWING_MAX);
        // 纸签：追着牌的摆角走，但慢半拍
        const ta = -46 * (s.tag[i] - s.swing[i] * 0.6) - 3.4 * s.vtag[i] - s.vswing[i] * 0.9;
        s.vtag[i] += ta * dt;
        s.tag[i] = clamp(s.tag[i] + s.vtag[i] * dt, -16, 16);
        if (reduce) { s.swing[i] = 0; s.tag[i] = 0; }
      }
    };

    const paint = () => {
      const { cw, mode } = live.current.size;
      const h = cw / 0.375;
      const a = live.current.open === null ? live.current.active : null;
      for (let i = 0; i < N; i++) {
        const slot = slots.current[i];
        if (!slot) continue;
        const rail = mode === "rail";
        const lift = rail ? clamp(s.lift[i], 0, 1.05) : 1;
        slot.style.transform = rail ? `translate3d(${(s.x[i] - cw / 2).toFixed(2)}px,0,0)` : "";
        // 遮挡顺序：牌是右边朝外侧身的，所以左边那张的近边要压在右边那张的远边上（左压右）
        slot.style.zIndex = rail ? String(a === i ? 60 : 10 + (N - i)) : "";
        const hang = hangs.current[i];
        if (hang) hang.style.transform = `rotate(${(s.swing[i] * HANG_SHARE).toFixed(3)}deg)`;
        const sw = swings.current[i];
        if (sw) sw.style.transform = `rotate(${(s.swing[i] * (1 - HANG_SHARE)).toFixed(3)}deg)`;
        const tn = turns.current[i];
        if (tn) tn.style.transform = rail ? `perspective(${PERSPECTIVE}px) rotateY(${s.turn[i].toFixed(2)}deg) translateZ(${(44 * lift).toFixed(2)}px) scale(${(1 + 0.06 * lift).toFixed(4)})` : "";
        const shade = shades.current[i];
        if (shade) shade.style.opacity = (1 - lift).toFixed(3);
        const glint = glints.current[i];
        if (glint) {
          glint.style.transform = `translate3d(${(-140 + 290 * lift).toFixed(1)}%,0,0) skewX(-14deg)`;
          glint.style.opacity = rail ? (Math.sin(Math.PI * clamp(lift, 0, 1)) * 0.9).toFixed(3) : "0";
        }
        // 墙上的影子：侧身时是贴墙的一道窄影；转正提起来后换成离得更远、更大的一片
        const near = nears.current[i];
        if (near) {
          near.style.opacity = (1 - lift).toFixed(3);
          near.style.transform = `translate3d(${(cw * 0.15).toFixed(1)}px, ${(h * 0.02).toFixed(1)}px, 0) scaleX(0.66)`;
        }
        const far = fars.current[i];
        if (far) {
          // 窄屏上牌一直是正面，没有"提起来"这回事：影子收近一些，别拖得太远
          const d = rail ? lift : 0.25;
          far.style.opacity = lift.toFixed(3);
          far.style.transform = `translate3d(${(cw * (0.06 + 0.16 * d)).toFixed(1)}px, ${(h * (0.014 + 0.05 * d)).toFixed(1)}px, 0) scale(${(1 + 0.04 * d).toFixed(3)})`;
        }
        const tag = tags.current[i];
        if (tag) tag.style.transform = `rotate(${(-8 + s.tag[i]).toFixed(2)}deg)`;
      }
    };

    let raf = 0, last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // 慢帧也按真实时间走：一帧最多补 100ms，拆成每步不超过 17ms 的小步去积分，弹簧才不会炸
      let left = Math.min(0.1, (now - last) / 1000);
      last = now;
      while (left > 0) {
        const dt = Math.min(0.017, left);
        step(dt);
        left -= dt;
      }
      paint();
    };

    const io = new IntersectionObserver(([entry]) => {
      live.current.visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);

    // 没人碰的时候，每隔几秒自动转正一张
    let auto = -1;
    const timer = window.setInterval(() => {
      const l = live.current;
      if (l.touched || !l.visible || l.open !== null || l.size.mode !== "rail" || reduce) return;
      auto = (auto + 1) % N;
      face(auto);
    }, 2800);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 鼠标：离谁近谁转正；划过时带起一阵风 */
  const onMove = (e: React.PointerEvent) => {
    if (size.mode !== "rail" || e.pointerType === "touch") return;
    const s = sim.current, el = stage.current;
    if (!s || !el) return;
    live.current.touched = true;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    let best = -1, dist = Infinity;
    for (let i = 0; i < N; i++) {
      const d = Math.abs(px - s.x[i]);
      if (d < dist) { dist = d; best = i; }
      const reach = size.cw * 0.9;
      if (d < reach) s.vswing[i] += clamp(e.movementX * 0.45, -12, 12) * (1 - d / reach);
    }
    const inBand = py > RAIL_Y && dist < ((size.W - EDGE * 2) / N) * 0.85;
    const next = inBand ? best : null;
    if (next !== live.current.active) face(next);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (size.mode === "rail" && e.pointerType !== "touch") face(null);
  };

  /* 窄屏：横向滑动时，牌跟着晃 */
  useEffect(() => {
    const el = strip.current;
    if (!el || size.mode !== "strip") return;
    let lastX = el.scrollLeft;
    const onScroll = () => {
      const dx = el.scrollLeft - lastX;
      lastX = el.scrollLeft;
      const s = sim.current;
      if (s) for (let i = 0; i < N; i++) s.vswing[i] += clamp(dx * 0.4, -14, 14);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [size.mode]);

  const cardH = Math.round(size.cw / 0.375);
  const hole = size.cw * 0.12; // 挂孔圆心离牌顶
  const railMode = size.mode === "rail";
  const shown = active !== null ? ITEMS[active] : null;

  const openCard = (i: number) => {
    live.current.touched = true;
    setOpen(i);
  };
  const close = () => {
    const i = open;
    setOpen(null);
    if (i !== null) turns.current[i]?.focus({ preventScroll: true });
  };

  return (
    <div>
      <div
        ref={stage}
        className="relative w-full select-none"
        style={{ height: RAIL_Y + HOOK + cardH + 56 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {/* 横杆：一根带高光的金属杆，底下在墙上投一道软影，两头各一个带螺丝的托架 */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[5]" style={{ top: RAIL_Y - RAIL_T / 2, height: RAIL_T }}>
          <div className="absolute inset-x-4 h-3 rounded-full bg-navy/20 blur-[6px]" style={{ top: RAIL_T + 3 }} />
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,rgb(var(--ink)/0.5)_0%,rgb(var(--ink)/0.82)_18%,rgb(var(--ink))_48%,rgb(var(--ink))_100%)] shadow-[inset_0_-2.5px_2px_rgb(0_0_0/0.35),0_1px_0_rgb(var(--ink)/0.14)]" />
          <div className="absolute inset-x-3 top-[1.5px] h-px rounded-full bg-white/50" />
          {[0, 1].map((side) => (
            <div
              key={side}
              className="absolute top-1/2 w-3.5 -translate-y-1/2 rounded-[3px] bg-[linear-gradient(to_right,rgb(var(--ink)/0.72),rgb(var(--ink))_55%,rgb(var(--ink))_100%)] shadow-[0_4px_8px_rgb(var(--ink)/0.3),inset_0_1px_0_rgb(255_255_255/0.25)]"
              style={{ [side ? "right" : "left"]: 10, height: RAIL_T * 2.9 }}
            >
              <span className="absolute left-1/2 top-[3px] h-1 w-1 -translate-x-1/2 rounded-full bg-white/35" />
              <span className="absolute bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/35" />
            </div>
          ))}
        </div>

        <div
          ref={strip}
          data-lenis-prevent={railMode ? undefined : true}
          className={cn("absolute inset-0", !railMode && "flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden")}
        >
          {ITEMS.map((m, i) => {
            const Art = ART[m.word]?.Art;
            return (
              <div
                key={m.word}
                ref={(el) => {
                  slots.current[i] = el;
                }}
                className={cn(railMode ? "absolute left-0 will-change-transform" : "relative shrink-0 snap-center")}
                style={{ top: railMode ? RAIL_Y : undefined, marginTop: railMode ? undefined : RAIL_Y, width: size.cw }}
              >
                {/* 钩子这一节：绕横杆转 */}
                <div
                  ref={(el) => {
                    hangs.current[i] = el;
                  }}
                  className="origin-top will-change-transform"
                >
                  <Hook height={HOOK + hole} />

                  {/* 牌这一节：绕挂孔转 */}
                  <div
                    ref={(el) => {
                      swings.current[i] = el;
                    }}
                    className="will-change-transform"
                    style={{ transformOrigin: `50% ${HOOK + hole}px`, paddingTop: HOOK }}
                  >
                    {/* 墙上的影子：两片虚化的圆角矩形，不跟着牌转身 */}
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 block" style={{ top: HOOK, height: cardH, filter: `blur(${Math.max(6, cardH * 0.022)}px)` }}>
                      <span
                        ref={(el) => {
                          nears.current[i] = el;
                        }}
                        className="absolute inset-0 block rounded-[8%/3%] bg-navy/40"
                      />
                      <span
                        ref={(el) => {
                          fars.current[i] = el;
                        }}
                        className="absolute inset-0 block rounded-[8%/3%] bg-navy/25 opacity-0"
                      />
                    </span>

                    <button
                      ref={(el) => {
                        turns.current[i] = el;
                      }}
                      type="button"
                      aria-label={`${m.word}，点开看它怎么拆`}
                      onClick={() => openCard(i)}
                      onFocus={() => railMode && face(i)}
                      onBlur={() => railMode && live.current.active === i && face(null)}
                      className="relative block w-full cursor-pointer rounded-[8%/3%] outline-offset-4 will-change-transform [transform-style:preserve-3d]"
                    >
                      {/* 厚度：一摞纸板。越往后越暗一点，最后一层是背阴面 */}
                      {SLAB.map((z) => (
                        <span
                          key={z}
                          aria-hidden
                          className="pointer-events-none absolute inset-0 block rounded-[8%/3%]"
                          style={{
                            transform: `translateZ(${-z}px)`,
                            background:
                              z === SLAB.length
                                ? "color-mix(in srgb, #fff 54%, rgb(var(--ink)))"
                                : `linear-gradient(to bottom, color-mix(in srgb, #fff ${95 - z * 2.2}%, rgb(var(--ink))), color-mix(in srgb, #fff ${84 - z * 2.2}%, rgb(var(--ink))))`,
                          }}
                        />
                      ))}
                      <span className="relative block">
                      <CardFace word={m.word} tone={ART[m.word]?.tone ?? "light"}>
                        {Art ? <Art /> : <div className="h-full w-full bg-flow" />}
                      </CardFace>
                      {/* 侧身时压在牌面上的暗影，转正时褪掉 */}
                      <span
                        ref={(el) => {
                          shades.current[i] = el;
                        }}
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[8%/3%] bg-[linear-gradient(90deg,rgb(var(--ink)/0.42),rgb(var(--ink)/0.14)_45%,rgb(var(--ink)/0.03))]"
                      />
                      {/* 转正途中扫过牌面的一道高光 */}
                      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8%/3%]">
                        <span
                          ref={(el) => {
                            glints.current[i] = el;
                          }}
                          className="absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.55)_50%,transparent)] opacity-0"
                        />
                      </span>
                      {/* 靠近我们的那条棱：一道受光的亮边，和后面的纸边接上 */}
                      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[8%/3%] shadow-[inset_-1.5px_0_0_rgb(255_255_255/0.55),inset_0_-1px_0_rgb(255_255_255/0.25)]" />
                      </span>
                    </button>

                    {/* 钩子上挂的小纸签 */}
                    <span
                      ref={(el) => {
                        tags.current[i] = el;
                      }}
                      aria-hidden
                      className="pointer-events-none absolute z-10 origin-top"
                      style={{ left: "calc(50% + 2px)", top: HOOK + hole, transform: "rotate(-8deg)" }}
                    >
                      <span className="block h-[13px] w-px bg-navy/45" />
                      <span className="relative -ml-2 block whitespace-nowrap rounded-[3px] bg-white px-1.5 pb-[4px] pt-[8px] text-[10px] font-bold leading-none tracking-[0.04em] text-navy shadow-[0_2px_6px_rgb(var(--ink)/0.28),inset_0_0_0_1px_rgb(var(--ink)/0.08)]">
                        <span className="absolute left-2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-navy/35" />
                        {m.how}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 杆下的一行字：转正的是哪张 */}
      <div className="relative h-14 text-center">
        {/* 换词时直接换，新的一行自己淡进来：鼠标扫得快也不会卡在上一个词 */}
        <motion.p
          key={railMode ? (shown?.word ?? "idle") : "strip"}
          className="absolute inset-0 flex items-center justify-center gap-3 text-[clamp(1rem,1.3vw,1.15rem)] text-navy-soft"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {railMode && shown ? (
            <>
              <span className="word text-[1.5em] tracking-[-0.02em] text-navy">{shown.word}</span>
              <span>点开，看它怎么拆</span>
            </>
          ) : railMode ? (
            "把鼠标移上去，哪张顺眼点哪张"
          ) : (
            "左右滑一滑，点开任意一张"
          )}
        </motion.p>
      </div>

      <Detail index={open} onClose={close} onNav={(d) => setOpen((v) => (v === null ? v : (v + d + N) % N))} />
    </div>
  );
}

/* ───────────────────────── 点开之后 ───────────────────────── */

function Detail({ index, onClose, onNav }: { index: number | null; onClose: () => void; onNav: (d: number) => void }) {
  const [mounted, setMounted] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);

  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    // 打开时锁住页面滚动
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted) return null;
  const m = index !== null ? ITEMS[index] : null;
  const Art = m ? ART[m.word]?.Art : null;

  return createPortal(
    <AnimatePresence>
      {m && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${m.word} 的拆解`}
          data-lenis-prevent
          className="fixed inset-0 z-[100] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl" onClick={onClose} />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[min(1000px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flow opacity-[0.16] blur-[130px]" />

          <div className="pointer-events-none relative mx-auto flex min-h-full max-w-[1120px] flex-col items-center justify-center gap-x-16 gap-y-9 px-6 pb-12 pt-16 lg:flex-row lg:py-10">
            {/* 左：放大的词牌，从侧身转到正面 */}
            <motion.div
              key={m.word}
              className="pointer-events-auto w-[118px] shrink-0 sm:w-[150px] lg:w-[min(27vh,248px)]"
              style={{ transformPerspective: 1100 }}
              initial={{ rotateY: -55, y: 30, opacity: 0 }}
              animate={{ rotateY: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 16 }}
            >
              <motion.div className="origin-top" animate={{ rotate: [0, 1.4, -0.9, 0.4, 0] }} transition={{ duration: 2.4, ease: "easeOut", delay: 0.2 }}>
                <CardFace word={m.word} tone={ART[m.word]?.tone ?? "light"} className="shadow-[0_50px_90px_-30px_rgb(var(--ink)/0.5),0_24px_48px_-24px_rgb(var(--g2)/0.6)]">
                  {Art ? <Art /> : <div className="h-full w-full bg-flow" />}
                </CardFace>
              </motion.div>
            </motion.div>

            {/* 右：把这个词拆给你看 */}
            <div className="pointer-events-auto w-full max-w-[560px]">
              <Breakdown key={m.word} m={m} />
            </div>
          </div>

          {/* 关闭、上一张、下一张 */}
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="fixed right-5 top-5 grid h-11 w-11 place-items-center rounded-full text-navy/60 transition-colors hover:bg-navy/5 hover:text-navy"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onNav(d)}
              aria-label={d < 0 ? "上一张" : "下一张"}
              className={cn(
                "fixed top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-[22px] text-navy/50 transition-all hover:bg-navy/5 hover:text-navy md:grid",
                d < 0 ? "left-4" : "right-4",
              )}
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** 拆解：字母升起 → 在音节处裂开 → 每段落一道括线和联想 → 一句话 → 词义 → 记忆场景 */
function Breakdown({ m }: { m: Mnemonic }) {
  const letters = m.segs.reduce((n, s) => n + s.t.length, 0);
  const split = 0.25 + letters * 0.03 + 0.25;
  const show = (d: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: d },
  });
  let li = 0;

  return (
    <div>
      <div className="word flex flex-wrap pb-[4rem] text-[clamp(2.3rem,5.4vw,4.6rem)] leading-none tracking-[-0.035em]">
        {m.segs.map((seg, si) => (
          <Fragment key={seg.t + si}>
            {si > 0 && (
              <motion.span
                aria-hidden
                className="inline-block overflow-hidden text-center"
                style={{ color: "rgb(var(--g2))" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "0.34em", opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: split }}
              >
                ·
              </motion.span>
            )}
            <span className="relative inline-block">
              {seg.t.split("").map((ch) => {
                const d = 0.2 + li++ * 0.03;
                return (
                  <motion.span key={li} className="inline-block" initial={{ opacity: 0, y: "0.4em" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: d }}>
                    {ch}
                  </motion.span>
                );
              })}
              <span className="absolute inset-x-0 top-[calc(100%+0.12em)] block tracking-normal" aria-hidden>
                <motion.span
                  className="block h-[6px] origin-left rounded-b-[3px] border-x border-b"
                  style={{ borderColor: "rgb(var(--g2))" }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: split + 0.2 + si * 0.14 }}
                />
                <motion.span
                  className="mt-2.5 flex flex-col items-center gap-1 whitespace-nowrap font-display"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: split + 0.45 + si * 0.14 }}
                >
                  <span className="bg-flow bg-clip-text text-[19px] font-bold leading-none text-transparent">{seg.note}</span>
                  {seg.sub && <span className="text-[12px] leading-none text-navy-faint">{seg.sub}</span>}
                </motion.span>
              </span>
            </span>
          </Fragment>
        ))}
      </div>

      <motion.p {...show(split + 0.85)} className="head text-[clamp(1.35rem,2.3vw,1.9rem)] leading-[1.5] ![letter-spacing:-0.01em]">
        <Parts parts={m.blueprint} soft />
      </motion.p>

      <motion.div {...show(split + 1)} className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[17px]">
        <span className="text-[rgb(var(--g2))]">→</span>
        <span className="text-navy-faint">{m.ipa}</span>
        <span className="italic text-navy-faint">{m.pos}</span>
        <span className="font-semibold">{m.meaning}</span>
      </motion.div>

      <motion.p {...show(split + 1.15)} className="mt-8 border-t border-navy/[0.1] pt-7 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.95] text-navy-soft">
        <Parts parts={m.scene} />
      </motion.p>
    </div>
  );
}

function Parts({ parts, soft = false }: { parts: Part[]; soft?: boolean }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className={cn("mx-[0.08em] rounded-[0.3em] px-[0.22em]", soft ? "bg-[rgb(var(--g2)/0.16)]" : "bg-[rgb(var(--g2)/0.18)] font-semibold text-navy")}>
            {part.h}
          </span>
        ),
      )}
    </>
  );
}
