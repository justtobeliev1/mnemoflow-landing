"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import { ScrubCaption } from "./ui";
import { currentSky, hexToRgb } from "./theme";
import { EXTRA, TREE } from "./word-web-data";

/**
 * 第六幕 · 长成（全页唯一的深色段落）
 *
 * 一张没有边的词汇网：很多点，相邻的点之间用直线相连。正中那个点是 quintessential。
 * 滚动时，从它出发一轮一轮把真实相关的词点亮（五轮，八十来个），光同时从中心往外漫开，镜头慢慢拉远。
 * 只有近处的点标了英文，远处的就是一个个没有名字的点。
 *
 * 点散在一团三维的空间里，整团悬浮着自转，镜头从里面退到外面。
 *
 * 一张 2D Canvas 自己做透视投影。为了不卡：线和点都按透明度（点还按大小）分桶，一桶一次画完；
 * 画布分辨率最多 1.5 倍；背景的光晕用渐变而不是模糊滤镜。
 */

type Pt = { x: number; y: number; z: number; r: number; phase: number; word: string; depth: number; show: number; extra: boolean; lead: number };
type Link = { a: number; b: number; depth: number; order: number; t: number; hold?: number };
type Net = { pts: Pt[]; edges: Uint32Array; links: Link[] };
type V3 = [number, number, number];

const rng = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const blank = (x: number, y: number, z: number, r: number, phase: number): Pt => ({ x, y, z, r, phase, word: "", depth: -1, show: 0, extra: false, lead: -1 });

/* ───────────────────────── 把点摆进空间 ───────────────────────── */

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const unit = (a: V3): V3 => {
  const n = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function buildCloud(): Net {
  const rnd = rng(17);
  const REACH = [0, 1.4, 1.2, 1.05, 0.95, 0.85]; // 每一轮往外伸多远
  const FIRST: V3[] = [[0.86, -0.4, 0.34], [-0.84, -0.36, -0.38], [-0.5, 0.76, 0.42], [0.56, 0.7, -0.44]];
  const index = new Map(TREE.map(([w], i) => [w, i]));
  const pts: Pt[] = TREE.map(([word]) => ({ ...blank(0, 0, 0, 0, rnd() * 6.28), word }));
  const dirs: V3[] = TREE.map(() => [0, 0, 1]);
  const kids: number[][] = TREE.map(() => []);
  TREE.forEach(([, parent], i) => parent && kids[index.get(parent)!].push(i));
  const links: Link[] = [];

  // 每个词从它的来处出发，沿来向再往外；同一个来处的几个词围成一个小锥
  const place = (i: number) => {
    kids[i].forEach((c, k) => {
      const d = (pts[c].depth = pts[i].depth + 1);
      if (d === 1) dirs[c] = unit(FIRST[k % FIRST.length]);
      else {
        const u = unit(cross(dirs[i], Math.abs(dirs[i][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
        const v = cross(dirs[i], u);
        const ang = (Math.PI * 2 * k) / kids[i].length + i * 1.7;
        const spread = kids[i].length === 1 ? 0.4 : 1.05;
        dirs[c] = unit(add(dirs[i], add(mul(u, Math.cos(ang) * spread), mul(v, Math.sin(ang) * spread))));
      }
      const pos = add([pts[i].x, pts[i].y, pts[i].z], mul(dirs[c], REACH[d]));
      [pts[c].x, pts[c].y, pts[c].z] = pos;
      pts[c].r = Math.hypot(...pos);
      links.push({ a: i, b: c, depth: d, order: k, t: 0 });
      pts[c].lead = links.length - 1;
      place(c);
    });
  };
  pts[0].depth = 0;
  place(0);

  // 周围再撒一千多个没有名字的点，填满一个大球
  const R = 10.5;
  while (pts.length < 1500) {
    const d = unit([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]);
    const rad = R * Math.cbrt(rnd());
    pts.push(blank(d[0] * rad, d[1] * rad * 0.8, d[2] * rad, rad, rnd() * 6.28));
  }
  let e = 0;
  for (let i = TREE.length; i < pts.length && e < EXTRA.length; i += 23) {
    const q = pts[i];
    if (q.r > 6.2 && q.r < 8.6) { q.word = EXTRA[e++]; q.extra = true; q.depth = 6; }
  }

  // 连线：每个点连到离它最近的两三个点，全是直线
  const seen = new Set<number>();
  const out: number[] = [];
  const link = (a: number, b: number) => {
    const key = a < b ? a * 4096 + b : b * 4096 + a;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(a, b);
  };
  links.forEach((l) => seen.add(l.a < l.b ? l.a * 4096 + l.b : l.b * 4096 + l.a)); // 词之间的线单独画
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const best = [-1, -1, -1], dist = [1e9, 1e9, 1e9];
    for (let j = 0; j < pts.length; j++) {
      if (j === i) continue;
      const b = pts[j];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z, d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= dist[2]) continue;
      let k = 2;
      while (k > 0 && d2 < dist[k - 1]) { dist[k] = dist[k - 1]; best[k] = best[k - 1]; k--; }
      dist[k] = d2; best[k] = j;
    }
    link(i, best[0]);
    link(i, best[1]);
    if (dist[2] < 1.1) link(i, best[2]);
  }
  return { pts, edges: Uint32Array.from(out), links };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
/** 在一组 [进度, 值] 之间线性取值 */
const along = (v: number, stops: number[][]) => {
  for (let i = 1; i < stops.length; i++)
    if (v <= stops[i][0]) return lerp(stops[i - 1][1], stops[i][1], (v - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  return stops[stops.length - 1][1];
};

const VIEW = {
  dist: [[0, 3.6], [0.2, 5.2], [0.44, 7.4], [0.7, 9.6], [1, 11]],
  pitch: [[0, 0.2], [1, 0.3]],
  centreY: [[0, 0.46], [1, 0.46]],
  reach: [[0, 0.5], [0.08, 1.7], [0.2, 2.9], [0.32, 4], [0.44, 5], [0.56, 6], [0.7, 8.5], [0.85, 30]],
  spin: 0.06, turn: 1.2, far: 9.5, fall: 1.4,
  // 点要小、要实：虚化只留一点点，不然一屏都是光斑，线反而看不见了
  bokeh: 0.4, fade: 1.3, line: 0.56,
};

const NODE_R = [0.8, 1.1, 1.5, 2, 2.8, 4, 6]; // 点的大小分档
const ALPHAS = 7; // 透明度分档

export function ActSix() {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const { pts, edges, links } = buildCloud();
    const view = VIEW;
    const N = pts.length, E = edges.length / 2;
    const labelled = pts.map((q, i) => (q.word ? i : -1)).filter((i) => i >= 0);
    const root = pts.findIndex((q) => q.depth === 0); // 主角
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let mx = -999, my = -999, dragging = false, lx = 0, ly = 0;
    let yawDrag = 0, yawVel = 0, pitchDrag = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // 触屏上让位给页面滚动
      dragging = true; lx = e.clientX; ly = e.clientY; yawVel = 0;
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      yawDrag += dx * 0.004; yawVel = dx * 0.004;
      pitchDrag = Math.max(-0.8, Math.min(0.8, pitchDrag + dy * 0.004));
    };
    const onUp = () => { dragging = false; cv.style.cursor = "grab"; };
    const onLeave = () => { mx = my = -999; };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", onLeave);

    // 每帧算好的屏幕坐标、到镜头的距离、缩放、透明度
    const sx = new Float32Array(N), sy = new Float32Array(N), sz = new Float32Array(N), ss = new Float32Array(N), al = new Float32Array(N);
    const edgeBins = Array.from({ length: ALPHAS }, () => [] as number[]);
    const nodeBins = Array.from({ length: ALPHAS * NODE_R.length }, () => [] as number[]);

    let last = performance.now(), spin = 0;
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = reduce ? 0 : now / 1000;
      const v = p.get();
      const unlocked = v < 0.08 ? 0 : v < 0.2 ? 1 : v < 0.32 ? 2 : v < 0.44 ? 3 : v < 0.56 ? 4 : 5;

      // 词与词之间的线：一轮一轮长出来，往回滚就收回去
      for (const l of links) {
        if (l.depth > unlocked) {
          l.hold = undefined;
          l.t += (0 - l.t) * Math.min(1, dt * 5);
          if (l.t < 0.002) l.t = 0;
          continue;
        }
        if (l.hold === undefined) l.hold = l.t > 0 ? 0 : l.order * 0.12;
        if (l.hold > 0) { l.hold -= dt; continue; }
        l.t += (1 - l.t) * Math.min(1, dt * 2.6);
        if (l.t > 0.998) l.t = 1;
      }
      const reach = along(v, view.reach); // 光往外漫到多远
      for (const i of labelled) {
        const q = pts[i];
        const on = q.extra ? q.r < reach : q.depth === 0 || links[q.lead].t > 0.92;
        q.show += ((on ? 1 : 0) - q.show) * Math.min(1, dt * 6);
      }

      // 镜头
      if (!dragging) { yawDrag += yawVel; yawVel *= 0.94; if (!reduce) spin += dt * view.spin; }
      const yaw = spin + yawDrag + v * view.turn + (mx > -900 && !dragging ? (mx / W - 0.5) * 0.14 : 0);
      const D = along(v, view.dist);
      const pitch = along(v, view.pitch) + pitchDrag + (my > -900 && !dragging ? (my / H - 0.5) * 0.1 : 0);
      const focal = Math.min(Math.max(H, W * 0.62), W * 1.5) * 0.95; // 竖屏上别按高度放大
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const cx0 = W / 2, cy0 = H * along(v, view.centreY);
      const far = D + view.far, fogFrom = D * 0.75;

      for (let i = 0; i < N; i++) {
        const q = pts[i];
        let y = q.y;
        if (!q.word) y += Math.sin(t * 0.35 + q.phase) * 0.07; // 悬着的点微微浮动
        const x1 = q.x * cosY + q.z * sinY, z1 = -q.x * sinY + q.z * cosY;
        const y2 = y * cosP + z1 * sinP, z2 = -y * sinP + z1 * cosP;
        const zc = D + z2; // 到镜头的距离
        if (zc < 0.5) { al[i] = 0; sz[i] = -1; continue; }
        const s = focal / zc;
        sx[i] = cx0 + x1 * s; sy[i] = cy0 - y2 * s; sz[i] = zc; ss[i] = s;
        const fog = smooth((far - zc) / (far - fogFrom)) * smooth((zc - 0.5) / 1.8); // 远处入雾，贴脸的也淡掉
        al[i] = fog * (0.16 + 0.84 * smooth((reach + 0.8 - q.r) / view.fall));
      }

      const pal = currentSky().flow.map((h) => hexToRgb(h));
      const colorAt = (x: number) => {
        const s = Math.min(0.999, Math.max(0, x / W)) * 3, i = Math.floor(s), f = s - i;
        return pal[i].map((c, k) => Math.round(c + (pal[i + 1][k] - c) * f));
      };
      const tint = `${Math.round(pal[1][0] * 0.35 + 166)},${Math.round(pal[1][1] * 0.35 + 166)},${Math.round(pal[1][2] * 0.35 + 166)}`; // 白里带一点天色

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";

      // 网线：按透明度分桶，一桶一次描完
      for (const b of edgeBins) b.length = 0;
      for (let k = 0; k < E; k++) {
        const a = edges[k * 2], b = edges[k * 2 + 1];
        const alpha = al[a] < al[b] ? al[a] : al[b];
        if (alpha < 0.02) continue;
        const ax = sx[a], bx = sx[b], ay = sy[a], by = sy[b];
        if ((ax < -60 && bx < -60) || (ax > W + 60 && bx > W + 60) || (ay < -60 && by < -60) || (ay > H + 60 && by > H + 60)) continue;
        edgeBins[Math.min(ALPHAS - 1, (alpha * ALPHAS) | 0)].push(k);
      }
      ctx.lineWidth = 0.9;
      for (let bi = 0; bi < ALPHAS; bi++) {
        const list = edgeBins[bi];
        if (!list.length) continue;
        ctx.strokeStyle = `rgba(${tint},${(((bi + 0.5) / ALPHAS) * view.line).toFixed(3)})`;
        ctx.beginPath();
        for (let n = 0; n < list.length; n++) {
          const k = list[n], a = edges[k * 2], b = edges[k * 2 + 1];
          ctx.moveTo(sx[a], sy[a]); ctx.lineTo(sx[b], sy[b]);
        }
        ctx.stroke();
      }

      // 点：离焦平面越远画得越大越虚。按"透明度 × 大小"分桶，一桶一次填完
      for (const b of nodeBins) b.length = 0;
      for (let i = 0; i < N; i++) {
        const a = al[i];
        if (a < 0.03 || sx[i] < -30 || sx[i] > W + 30 || sy[i] < -30 || sy[i] > H + 30) continue;
        const blur = Math.min(2.6, (Math.abs(sz[i] - D) / D) * 1.7);
        const alpha = (a * 0.95) / (1 + blur * blur * view.fade);
        if (alpha < 0.015) continue;
        const rad = (0.017 * ss[i] + 0.55) * (1 + blur * view.bokeh);
        let ri = 0;
        while (ri < NODE_R.length - 1 && NODE_R[ri] < rad) ri++;
        nodeBins[Math.min(ALPHAS - 1, (alpha * ALPHAS) | 0) * NODE_R.length + ri].push(i);
      }
      for (let bi = 0; bi < nodeBins.length; bi++) {
        const list = nodeBins[bi];
        if (!list.length) continue;
        const R = NODE_R[bi % NODE_R.length];
        ctx.fillStyle = `rgba(${tint},${((((bi / NODE_R.length) | 0) + 0.5) / ALPHAS * 0.95).toFixed(3)})`;
        ctx.beginPath();
        for (let n = 0; n < list.length; n++) {
          const i = list[n];
          ctx.moveTo(sx[i] + R, sy[i]); ctx.arc(sx[i], sy[i], R, 0, 6.2832);
        }
        ctx.fill();
      }

      // 鼠标最近的词
      let hover = -1, best = 28;
      if (!dragging && mx > -900)
        for (const i of labelled) {
          if (pts[i].show < 0.5 || al[i] < 0.1) continue;
          const d = Math.hypot(sx[i] - mx, sy[i] - my);
          if (d < best) { best = d; hover = i; }
        }

      // 词与词之间的线：带天色的亮线，从旧词直直地长到新词，线头一颗实心的小亮点
      for (const l of links) {
        if (l.t <= 0.001 || sz[l.a] < 0 || sz[l.b] < 0) continue;
        const ax = sx[l.a], ay = sy[l.a];
        const bx = lerp(ax, sx[l.b], l.t), by = lerp(ay, sy[l.b], l.t);
        const col = colorAt((ax + bx) / 2);
        const hot = hover === l.a || hover === l.b;
        const a0 = Math.min(1, Math.min(al[l.a], al[l.b]) * (hot ? 1.5 : 1));
        if (a0 < 0.02) continue;
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(a0 * 0.16).toFixed(3)})`;
        ctx.lineWidth = hot ? 7.5 : 6;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(a0 * 0.95).toFixed(3)})`;
        ctx.lineWidth = hot ? 2 : 1.6;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        // 线头：只是一颗实心的小亮点，不带光晕
        if (l.t < 0.985) {
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, 6.2832); ctx.fill();
        }
      }

      // 有名字的点：一圈收得很紧的光晕 + 一颗白芯。正中的主角单独画，放在最后
      const ref = focal / D; // 焦平面上的缩放，用来把大小换算成"相对大小"
      const SIZES = [7.6, 3.1, 2.6, 2.2, 2, 1.8];
      for (const i of labelled) {
        const q = pts[i];
        if (q.depth === 0 || q.show < 0.01 || al[i] < 0.03) continue;
        const col = colorAt(sx[i]);
        const k = q.show * Math.min(1, al[i] * 1.3) * (q.extra ? 0.55 : 1);
        const base = (SIZES[q.depth] ?? 2.6) * Math.min(1.5, ss[i] / ref) * (hover === i ? 1.35 : 1);
        const halo = base * 2.7 * (reduce ? 1 : 1 + Math.sin(t * 1.5 + i) * 0.08);
        const g = ctx.createRadialGradient(sx[i], sy[i], 0, sx[i], sy[i], halo);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${(0.7 * k).toFixed(3)})`);
        g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(sx[i], sy[i], halo, 0, 6.2832); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.55 + 0.45 * k).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(sx[i], sy[i], base, 0, 6.2832); ctx.fill();
      }

      // 字：正中的 quintessential 永远在最上层。先算出它占的那一块，别的词压到这一块上就不画；
      // 其余的词按"浅的轮次先、近的先"来排，被前面的词挡住的退成很淡的影子
      ctx.textAlign = "center";
      const rootScale = Math.min(1.25, Math.max(0.7, ss[root] / ref));
      const rootSize = Math.max(26, Math.min(48, W * 0.033)) * rootScale;
      const rootBase = SIZES[0] * rootScale * (hover === root ? 1.2 : 1);
      const rootFont = `700 ${rootSize.toFixed(1)}px "Geist Variable", system-ui, sans-serif`;
      ctx.font = rootFont;
      const rw = ctx.measureText(pts[root].word).width, rty = sy[root] - rootBase - rootSize * 0.55;
      const rx0 = sx[root] - rw / 2 - 10, ry0 = rty - rootSize * 0.95, rx1 = sx[root] + rw / 2 + 10, ry1 = rty + rootSize * 0.38;

      const order = labelled.filter((i) => i !== root && pts[i].show > 0.01 && al[i] > 0.05).sort((a, b) => pts[a].depth - pts[b].depth || sz[a] - sz[b]);
      if (hover >= 0 && order.includes(hover)) { order.splice(order.indexOf(hover), 1); order.unshift(hover); }
      const taken: number[] = [];
      for (const i of order) {
        const q = pts[i];
        const scale = Math.min(1.25, Math.max(0.7, ss[i] / ref));
        const size = ([0, 17, 15, 13.5, 12.5, 12][q.depth] ?? 12) * scale;
        const base = (SIZES[q.depth] ?? 2.6) * scale;
        ctx.font = `${q.depth === 1 ? 600 : 500} ${size.toFixed(1)}px "Geist Variable", system-ui, sans-serif`;
        const w = ctx.measureText(q.word).width, ty = sy[i] - base - size * 0.6;
        const x0 = sx[i] - w / 2 - 6, y0 = ty - size, x1 = sx[i] + w / 2 + 6, y1 = ty + size * 0.4;
        if (x0 < rx1 && x1 > rx0 && y0 < ry1 && y1 > ry0) continue; // 压到主角身上了：让开
        let blocked = false;
        for (let n = 0; n < taken.length; n += 4)
          if (x0 < taken[n + 2] && x1 > taken[n] && y0 < taken[n + 3] && y1 > taken[n + 1]) { blocked = true; break; }
        if (!blocked) taken.push(x0, y0, x1, y1);
        const a = q.show * Math.min(1, al[i] * 1.4) * (q.extra ? 0.5 : 0.92) * (blocked ? 0.12 : 1) * (hover === i ? 1.3 : 1);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a).toFixed(3)})`;
        ctx.fillText(q.word, sx[i], ty);
      }

      // 最后画主角：一颗带天色渐变的点，和它的名字
      if (sz[root] > 0) {
        const halo = rootBase * 3.4 * (reduce ? 1 : 1 + Math.sin(t * 1.5) * 0.08);
        const hg = ctx.createRadialGradient(sx[root], sy[root], 0, sx[root], sy[root], halo);
        const mid = pal[2];
        hg.addColorStop(0, `rgba(${mid[0]},${mid[1]},${mid[2]},0.6)`);
        hg.addColorStop(1, `rgba(${mid[0]},${mid[1]},${mid[2]},0)`);
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(sx[root], sy[root], halo, 0, 6.2832); ctx.fill();
        const cg = ctx.createLinearGradient(sx[root] - rootBase, sy[root] - rootBase, sx[root] + rootBase, sy[root] + rootBase);
        cg.addColorStop(0, `rgb(${pal[0][0]},${pal[0][1]},${pal[0][2]})`);
        cg.addColorStop(0.5, `rgb(${pal[2][0]},${pal[2][1]},${pal[2][2]})`);
        cg.addColorStop(1, `rgb(${pal[3][0]},${pal[3][1]},${pal[3][2]})`);
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(sx[root], sy[root], rootBase, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.font = rootFont;
        ctx.fillStyle = "#fff";
        ctx.fillText(pts[root].word, sx[root], rty);
      }
    };

    let raf = 0, visible = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!document.hidden) draw(now);
    };
    // 提前一屏就开始画：滚进来的那一下，画布已经是热的
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) { visible = true; last = performance.now(); raf = requestAnimationFrame(loop); }
        else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(raf); }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(cv);
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, [p]);

  return (
    <section id="act-6" ref={track} data-dark className="relative h-[420svh] bg-[#080a12] text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* 远处的一点天色：用渐变画，不用模糊滤镜（大面积的模糊在滚进来时会卡一下） */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(52% 46% at 50% 42%, rgb(var(--g2) / 0.16), rgb(var(--g1) / 0.05) 55%, transparent 78%)" }}
        />
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full cursor-grab touch-pan-y"
          role="img"
          aria-label="一张向四面铺开、没有边的词汇网，正中是 quintessential"
        />
        {/* 四周压一圈暗角，网像是从黑里浮出来的 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_55%,#080a12_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-[6svh] px-6 text-center">
          <div className="relative mx-auto h-[5.5rem] max-w-[44rem]">
            <div aria-hidden className="absolute -inset-x-24 -inset-y-12" style={{ background: "radial-gradient(50% 50% at 50% 55%, rgb(8 10 18 / 0.88), rgb(8 10 18 / 0.5) 60%, transparent)" }} />
            <ScrubCaption dark p={p} from={0} to={0.07} title="记住一个，带出一串" />
            <ScrubCaption dark p={p} from={0.1} to={0.19} title="essential、queen 和 quintet" sub="都是你的老熟人" />
            <ScrubCaption dark p={p} from={0.23} to={0.55} title="老熟人又各有各的朋友" sub="一个带一个" />
            <ScrubCaption dark p={p} from={0.6} to={0.8} title="认识的词越多，新词越好记" />
            <ScrubCaption dark p={p} from={0.85} to={1.1} title="你认识的每个词，都在帮你记下一个" />
          </div>
        </div>
      </div>
    </section>
  );
}
