"use client";

/**
 * 词海：几十张单词牌排在一个透明的球面上，可以拖、可以甩，松手后带着惯性慢慢停下。
 *
 * 思路借自 Cue 的 Interactive Card Sphere（四元数转球、斐波那契布点、每帧直接写 DOM、不触发 React 重渲染），
 * 但内容和行为都按这个页面重写了：
 *   · 牌面是英文单词，不是图形；
 *   · 不劫持滚轮——页面滚动照常，滚动进度反过来驱动这个球；
 *   · 开头多了一段"汇入"：首屏那四张产品卡片（guests）一开始摆在首屏原来的位置，
 *     merge 从 0 到 1 时它们飞到球面上各自的位置、缩小，成为球上的四张牌，其余的单词牌同时浮现；
 *   · 结尾多了一段"聚焦"：focus 从 0 到 1 时，主角词被转到正前方，其余的牌向外散开淡出；
 *     grow 从 0 到 1 时，主角词的牌面褪去，只剩单词本身放大到下一幕的字号，好和第一幕无缝接上。
 */

import { useEffect, useRef, type ReactNode } from "react";
import type { MotionValue } from "framer-motion";

/* ───────── 数学 ───────── */
type Vec = { x: number; y: number; z: number };
type Quat = [number, number, number, number];
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const V = (x: number, y: number, z: number): Vec => ({ x, y, z });
const norm = (a: Vec) => {
  const n = Math.hypot(a.x, a.y, a.z) || 1;
  return V(a.x / n, a.y / n, a.z / n);
};
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: Vec, b: Vec) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const qmul = (a: Quat, b: Quat): Quat => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
  a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
  a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
];
const qaxis = (axis: Vec, ang: number): Quat => {
  const s = Math.sin(ang / 2), a = norm(axis);
  return [Math.cos(ang / 2), a.x * s, a.y * s, a.z * s];
};
const qnorm = (q: Quat): Quat => {
  const n = Math.hypot(q[0], q[1], q[2], q[3]);
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
};
const qrot = (q: Quat, v: Vec): Vec => {
  const [w, x, y, z] = q;
  const ix = w * v.x + y * v.z - z * v.y, iy = w * v.y + z * v.x - x * v.z, iz = w * v.z + x * v.y - y * v.x, iw = -x * v.x - y * v.y - z * v.z;
  return V(ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x);
};
const qslerp = (a: Quat, b: Quat, t: number): Quat => {
  let c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (c < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; c = -c; }
  if (c > 0.9995) return qnorm([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]);
  const th = Math.acos(c), s = Math.sin(th), ka = Math.sin((1 - t) * th) / s, kb = Math.sin(t * th) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb, a[3] * ka + b[3] * kb];
};
const qbetween = (from: Vec, to: Vec): Quat => {
  const c = clamp(dot(from, to), -1, 1);
  if (c > 0.99999) return [1, 0, 0, 0];
  return qaxis(c < -0.99999 ? V(0, 1, 0) : cross(from, to), Math.acos(c));
};
/** 斐波那契球面布点：n 个点均匀铺在球面上 */
const fib = (n: number, i: number, off = 0) => {
  const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = Math.PI * (3 - Math.sqrt(5)) * i + off;
  return V(Math.cos(t) * r, y, Math.sin(t) * r);
};

/* ───────── 内容 ───────── */
/** 球面上有八个"大位"：第一个是主角词，三个是别的词，剩下四个留给首屏那四张产品卡片 */
const BIG = ["quintessential", "ubiquitous", "meticulous", "resilient"];
const BIG_SLOTS = 8;

/**
 * 四张首屏卡片在首屏时的摆法，坐标是相对于一个 700×600 的参考框（home 返回它在屏幕上的位置）。
 * cx/cy 给的是卡片中心；ay 表示 cy 是相对卡片的顶边(0)、中心(0.5)还是底边(1)来定的；lift 是纵深带来的放大。
 */
const GUEST_HOME = [
  { cx: 250, y: 70, ay: 0, lift: 1 },
  { cx: 594, y: -26, ay: 0, lift: 1.06 },
  { cx: 201, y: 574, ay: 1, lift: 1.1 },
  { cx: 535, y: 600, ay: 1, lift: 1.145 },
];
/** 卡片上了球之后相对自身原尺寸的缩放 */
const GUEST_ON_SPHERE = 0.6;
const SMALL = [
  "abandon", "abstract", "accumulate", "adequate", "advocate", "allocate", "anticipate", "arbitrary", "benevolent", "candid",
  "coherent", "coincide", "compel", "comprise", "conceive", "consensus", "contemplate", "contradict", "crucial", "deficiency",
  "deliberate", "depict", "deteriorate", "diminish", "discrete", "distort", "elaborate", "eloquent", "embrace", "emerge",
  "endeavor", "enhance", "erode", "evoke", "explicit", "exploit", "feasible", "fluctuate", "formidable", "fragile",
  "generic", "hierarchy", "hypothesis", "illuminate", "implicit", "incentive", "inevitable", "inherent", "integrity", "intervene",
  "intricate", "intuition", "legitimate", "mediate", "notion", "obscure", "paradox", "perceive", "plausible", "pragmatic",
  "prevail", "profound", "reluctant", "scrutiny", "subtle", "tangible", "tentative", "trivial", "undermine", "versatile",
];
// 类名要写全：Tailwind 靠在源码里找到完整的类名来决定保留哪些样式，拼出来的它认不出
const SKINS = ["ws-light", "ws-light", "ws-light", "ws-light", "ws-light", "ws-dark", "ws-flow"];
const BIG_SKINS = ["ws-light", "ws-dark", "ws-flow", "ws-light"];
/** 大牌上单词的基准字号（px，未缩放） */
const BIG_FONT = 54;

type Card = {
  word: string;
  p: Vec;
  big: boolean;
  target: boolean;
  /** 首屏卡片的序号；普通词牌是 -1 */
  guest: number;
  skin: string;
  font: number;
  rz: number;
  w: number;
  h: number;
  el: HTMLDivElement;
  bg: HTMLDivElement | null;
  tag: HTMLSpanElement | null;
};

const P = 2; // 相机到球心的距离 / 球半径

export function WordSphere({
  merge,
  spin,
  focus,
  grow,
  targetFontPx,
  guests,
  home,
}: {
  /** 0→1：首屏卡片飞上球面，单词牌浮现 */
  merge: MotionValue<number>;
  /** 四张首屏卡片（React 节点），由这里接管它们的位置 */
  guests: ReactNode[];
  /** 首屏参考框此刻在屏幕上的位置 */
  home: () => DOMRect | null;
  /** 0→1：滚动带着球多转一些 */
  spin: MotionValue<number>;
  /** 0→1：把主角词转到正前方，其余散开 */
  focus: MotionValue<number>;
  /** 0→1：主角词褪去牌面，放大到下一幕的字号 */
  grow: MotionValue<number>;
  /** 下一幕里那个巨型单词此刻的字号（px） */
  targetFontPx: () => number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef(targetFontPx);
  fontRef.current = targetFontPx;
  const homeRef = useRef(home);
  homeRef.current = home;

  useEffect(() => {
    const root = rootRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 搭牌：每次都一样（固定种子） */
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cards: Card[] = [];
    const make = (word: string, p: Vec, big: boolean, i: number) => {
      const el = document.createElement("div");
      const skin = big ? BIG_SKINS[i % BIG_SKINS.length] : SKINS[Math.floor(rnd() * SKINS.length)];
      const font = big ? BIG_FONT : 26 + Math.floor(rnd() * 16);
      el.className = `ws-c ${skin}`;
      el.style.fontSize = font + "px";
      el.style.padding = big ? "1.05em 0.75em 0.85em" : "0.62em 0.9em";
      el.style.borderRadius = (big ? 0.34 : 0.7) * font + "px";
      const bg = document.createElement("div");
      bg.className = "ws-bg";
      const label = document.createElement("span");
      label.textContent = word;
      el.append(bg, label);
      let tag: HTMLSpanElement | null = null;
      if (big) {
        tag = document.createElement("span");
        tag.className = "ws-tag";
        tag.textContent = "adj.";
        el.append(tag);
      }
      root.appendChild(el);
      cards.push({ word, p, big, target: big && i === 0, guest: -1, skin, font, rz: big ? (rnd() - 0.5) * 3 : (rnd() - 0.5) * 9, w: 1, h: 1, el, bg, tag });
    };
    const slots = Array.from({ length: BIG_SLOTS }, (_, i) => fib(BIG_SLOTS, i, 1.1));
    // 四张首屏卡片占离主角词最远的四个大位：它们汇入时主角词还藏在背面
    const far = slots.map((p, i) => ({ i, d: dot(p, slots[0]) })).slice(1).sort((a, b) => a.d - b.d).slice(0, 4).map((o) => o.i);
    const rest = slots.map((_, i) => i).filter((i) => i !== 0 && !far.includes(i));
    make(BIG[0], slots[0], true, 0);
    rest.forEach((slot, k) => make(BIG[k + 1], slots[slot], true, k + 1));
    const guestEls = Array.from(root.querySelectorAll<HTMLDivElement>("[data-guest]"));
    guestEls.forEach((el, g) => {
      cards.push({ word: "", p: slots[far[g]], big: true, target: false, guest: g, skin: "", font: 1, rz: (rnd() - 0.5) * 4, w: 1, h: 1, el, bg: null, tag: null });
    });
    const bigs = cards.slice();
    SMALL.forEach((w, i) => {
      const p = fib(SMALL.length, i, 0.37);
      p.x += (rnd() - 0.5) * 0.07; p.y += (rnd() - 0.5) * 0.07; p.z += (rnd() - 0.5) * 0.07;
      const q = norm(p);
      if (bigs.some((b) => dot(b.p, q) > 0.9)) return; // 大牌周围留点空
      make(w, q, false, i);
    });
    const target = cards[0];
    // 主角词最后要放大好几倍：不能让浏览器按初始尺寸缓存成位图，否则放大后是糊的
    target.el.style.willChange = "auto";

    let W = 0, H = 0, u = 1, F = 1, Ax = 1, Ay = 1;
    const measure = () => {
      const r = root.getBoundingClientRect();
      W = r.width; H = r.height;
      u = Math.min(W, H * 0.8) / 720;
      F = 502 * u;
      // 把球拉成椭球，铺满画面
      Ax = Math.max(1, (W / 2 / (F * 0.577)) * 0.97);
      Ay = Math.max(1, (H / 2 / (F * 0.577)) * 0.97);
      for (const c of cards) {
        // 被裁掉（display:none）的牌量出来是 0，会让后面的透视计算崩掉：先临时显示再量
        const hidden = c.el.style.display === "none";
        if (hidden) c.el.style.display = "";
        const w = c.el.offsetWidth, h = c.el.offsetHeight;
        if (w > 0 && h > 0) { c.w = w; c.h = h; }
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);

    const FRONT = V(0, 0, 1);
    // 起始姿态：四张首屏卡片要去的那一面朝前（主角词因此在背面，不会一上来就剧透）
    const facing = norm(far.reduce((a, i) => V(a.x + slots[i].x, a.y + slots[i].y, a.z + slots[i].z), V(0, 0, 0)));
    let rot = qbetween(facing, FRONT);
    const t0 = performance.now();
    let px = 0, py = 0, tpx = 0, tpy = 0; // 鼠标位置（-0.5…0.5），首屏卡片跟着它微微转
    const DRIFT = reduce ? V(0, 0, 0) : V(0.035, 0.13, 0); // 没人碰的时候自己慢慢转
    let wv = V(DRIFT.x, DRIFT.y, DRIFT.z);
    let drag: { x: number; y: number } | null = null;
    let lastSpin = spin.get();
    const samples: [number, number, number][] = [];

    const turn = (dx: number, dy: number) => {
      const ang = Math.hypot(dx / Ax, dy / Ay) / (F * 0.5);
      if (ang > 0) rot = qnorm(qmul(qaxis(V(dy / Ay, dx / Ax, 0), ang), rot));
    };

    const render = (dt: number) => {
      const cx = W / 2, cy = H / 2;
      const e = smooth(clamp(focus.get()));
      const g = smooth(clamp(grow.get()));
      const mg = smooth(clamp(merge.get()));
      const appear = smooth(clamp(merge.get() * 1.5 - 0.35)); // 单词牌比卡片晚一点浮现
      const now = performance.now();
      px += (tpx - px) * 0.06; py += (tpy - py) * 0.06;
      const box = mg < 1 ? homeRef.current() : null;
      const rootBox = box ? root.getBoundingClientRect() : null;
      // 汇入完成之前，这一层不拦鼠标（首屏的按钮要能点）
      const interactive = mg > 0.9;
      if (root.dataset.live !== String(interactive)) {
        root.dataset.live = String(interactive);
        root.style.pointerEvents = interactive ? "auto" : "none";
      }

      // 滚动带来的额外旋转
      const sp = spin.get();
      if (sp !== lastSpin) {
        rot = qnorm(qmul(qaxis(V(0.18, 1, 0), (sp - lastSpin) * 2.6), rot));
        lastSpin = sp;
      }
      // 惯性：甩出去的速度慢慢衰减回"自己漂"的速度
      if (!drag) {
        const k = Math.pow(0.9, dt * 30);
        wv = V(lerp(DRIFT.x, wv.x, k), lerp(DRIFT.y, wv.y, k), lerp(DRIFT.z, wv.z, k));
        const s = Math.hypot(wv.x, wv.y, wv.z);
        if (s > 0.0005) rot = qnorm(qmul(qaxis(wv, s * dt * (1 - e)), rot));
      }
      // 聚焦：从当前姿态球面插值到"主角词朝前"
      const toFront = qnorm(qmul(qbetween(qrot(rot, target.p), FRONT), rot));
      const view = e > 0 ? qslerp(rot, toFront, e) : rot;
      const goalFont = fontRef.current();

      for (const c of cards) {
        const el = c.el;
        const q = qrot(view, c.p), d = P - q.z, s = 1 / d;
        // 其余的牌在聚焦时向外推开；刚浮现时则是从外面收拢进来
        const push = c.target ? 1 : 1 + e * 0.9 + (c.guest < 0 ? (1 - appear) * 0.45 : 0);
        let sx = cx + q.x * F * s * Ax * push, sy = cy - q.y * F * s * Ay * push;
        const k = clamp((q.z - 0.2) / 0.55);
        const hf = c.big ? lerp(0.55, 1, smooth(k)) : 0.8; // 大牌只有转到前面才变大
        let sc = s * u * hf * (c.guest >= 0 ? GUEST_ON_SPHERE : 1);
        let rz = c.rz;
        let tiltX: number | null = null, tiltY = 0, alpha = 1;
        if (c.guest >= 0 && mg < 1 && box && rootBox) {
          // 首屏卡片：在"首屏的摆法"和"球面上的位置"之间插值
          const hm = GUEST_HOME[c.guest];
          const bs = box.width / 700;
          const hs = bs * hm.lift;
          const intro = smooth(clamp((now - t0 - 250 - c.guest * 150) / 1200)); // 入场：依次升起
          const bob = reduce ? 0 : Math.sin(now / 1000 / (0.9 + c.guest * 0.13) + c.guest) * (5 + c.guest * 1.5);
          const hx = box.left - rootBox.left + hm.cx * bs;
          const hy = box.top - rootBox.top + (hm.y + (0.5 - hm.ay) * c.h * hm.lift) * bs + bob * bs + (1 - intro) * 70;
          sx = lerp(hx, sx, mg); sy = lerp(hy, sy, mg);
          sc = lerp(hs, sc, mg);
          rz = lerp(2.5, c.rz, mg);
          tiltX = 8 - py * 10; tiltY = -19 + px * 12;
          alpha = intro;
        }
        if (c.target) {
          // 放大到下一幕的字号：此时它就在正前方，s = 1
          sc = lerp(sc, goalFont / c.font, g);
          rz = c.rz * (1 - e);
        }
        const ew = c.w * sc, eh = c.h * sc;
        if (sx + ew < -40 || sx - ew > W + 40 || sy + eh < -40 || sy - eh > H + 40) {
          if (el.style.display !== "none") el.style.display = "none";
          continue;
        }
        if (el.style.display === "none") el.style.display = "";
        const tilt = 0.35 * (c.target ? 1 - e : 1);
        let ry = Math.atan2(q.x, Math.max(0.2, q.z)) * 57.3 * tilt, rx = Math.atan2(q.y, Math.max(0.2, q.z)) * 57.3 * tilt;
        let persp = Math.max(240, c.w * 2.6);
        if (tiltX !== null) {
          rx = lerp(tiltX, rx, mg); ry = lerp(tiltY, ry, mg);
          persp = lerp(1900, persp, mg);
        }
        el.style.transform = `translate(${sx}px,${sy}px) scale(${sc}) perspective(${persp}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rz}deg) translate(${-c.w / 2}px,${-c.h / 2}px)`;
        const zSphere = Math.round((3 - d) * 1000) + (c.target ? Math.round(e * 5000) : 0);
        el.style.zIndex = String(c.guest >= 0 && mg < 0.6 ? 6000 + c.guest : zSphere);
        // 小牌：转到背面的那一半直接隐去，不留一片灰影；越靠前越实
        const depth = c.big ? clamp((q.z + 0.9) / 0.3) : Math.pow(clamp((q.z + 0.45) / 0.9), 1.4);
        const base = c.guest >= 0 ? lerp(1, depth, mg) * alpha : depth * appear;
        el.style.opacity = String(c.target ? Math.max(depth * appear, e) : base * (1 - clamp(e * 1.25)));
        if (c.target && c.bg) {
          c.bg.style.opacity = String(1 - clamp(g * 1.6));
          if (c.tag) c.tag.style.opacity = String(0.5 * (1 - clamp(g * 3)));
        }
      }
    };

    const onPointer = (ev: PointerEvent) => {
      tpx = ev.clientX / window.innerWidth - 0.5;
      tpy = ev.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    const onDown = (ev: PointerEvent) => {
      if (merge.get() < 0.9 || focus.get() > 0.15) return; // 还没汇入完，或已经开始聚焦，都不让拖
      drag = { x: ev.clientX, y: ev.clientY };
      wv = V(0, 0, 0);
      samples.length = 0;
      root.classList.add("grabbing");
      try { root.setPointerCapture(ev.pointerId); } catch {}
    };
    const onMove = (ev: PointerEvent) => {
      if (!drag) return;
      const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      drag.x = ev.clientX; drag.y = ev.clientY;
      turn(dx, dy);
      const now = performance.now();
      samples.push([now, dx, dy]);
      while (samples.length && now - samples[0][0] > 90) samples.shift();
    };
    const onUp = () => {
      if (!drag) return;
      drag = null;
      root.classList.remove("grabbing");
      if (samples.length > 1) {
        const span = Math.max(0.016, (samples[samples.length - 1][0] - samples[0][0]) / 1000);
        const vx = samples.reduce((a, s) => a + s[1], 0) / span, vy = samples.reduce((a, s) => a + s[2], 0) / span;
        const k = 1 / (F * 0.5);
        wv = V((vy / Ay) * k, (vx / Ax) * k, 0);
      }
    };
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);

    // 只在看得见的时候跑
    let raf = 0, last = performance.now(), visible = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) render(dt);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(root);
    render(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onPointer);
      cards.forEach((c) => c.guest < 0 && c.el.remove());
    };
  }, [merge, spin, focus, grow]);

  return (
    <div ref={rootRef} className="ws" aria-label="首屏的四张产品卡片汇入一个由英文单词组成的球，可以拖动旋转">
      {guests.map((node, i) => (
        <div key={i} data-guest={i} className="ws-guest">
          {node}
        </div>
      ))}
    </div>
  );
}
