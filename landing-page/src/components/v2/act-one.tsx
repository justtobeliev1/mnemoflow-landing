"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Gradient } from "./gradient";
import { Guides, HeroCopy } from "./hero";
import { HERO_CARDS } from "./hero-cards";
import { ScrubCaption } from "./ui";
import { WordSphere } from "./word-sphere";

/**
 * 首屏 → 词海 → 第一幕 · 初见
 * 这三段共用同一个钉住的舞台，滚动条就是进度条：
 *   0 … HERO     首屏。文案上移淡出，右边四张产品卡片飞上球面，单词牌在它们周围浮现；
 *   HERO … SEA   词海。几十张牌组成的球，滚动时主角词被转到面前、放大，化成第一幕的巨型单词；
 *   SEA … 1      第一幕。
 * 之后这个单词依次经历：
 *   完整 → 字母散开（硬背的样子）→ 聚成两块 → 翻面露出联想 → 上移并长出记忆场景 → 得到词义
 * 所有动画都直接由滚动进度驱动，可以来回倒着看。
 */

const SEGS = [
  { t: "quint", assoc: "Queen’s", zh: "女王的" },
  { t: "essential", assoc: "essential", zh: "必要的" },
];

// 每个字母散开时飞去的位置（vw, vh, 旋转角度）。写死而不是随机，保证服务端和客户端一致。
const SCATTER: [number, number, number][] = [
  [-30, -18, -40], [-12, 20, 25], [-38, 8, 60], [-20, -26, -15], [4, -21, 35],
  [-6, 15, -55], [22, -25, 20], [34, 6, -30], [12, 23, 48], [-28, 25, -65],
  [28, -10, 70], [38, 18, -20], [16, -5, -45], [-4, -29, 30],
];

/** 首屏占整条时间轴的前多少 */
const HERO = 0.085;
/** 词海结束的位置 */
const SEA = 0.32;
/** 把"词海内部的进度"换算成整条时间轴上的位置 */
const sea = (x: number) => HERO + x * (SEA - HERO);
/** 把"第一幕内部的进度"换算成整条时间轴上的位置 */
const m = (x: number) => SEA + x * (1 - SEA);

const GUESTS = HERO_CARDS.map(({ width, Card }, i) => (
  <div key={i} style={{ width }}>
    <Card />
  </div>
));

// 关键进度点（第一幕内部的 0–1，用的时候过一遍 m）
const T: Record<string, number[]> = {
  scatter: [0.09, 0.2, 0.27, 0.38].map(m), // 散开 → 悬停 → 收拢
  tile: [0.3, 0.4].map(m), // 聚成两块牌
  flip: [0.46, 0.58].map(m), // 翻面
  rise: [0.6, 0.7].map(m), // 上移缩小
  wire: [0.69, 0.75].map(m), // 牌和卡片之间的箭头显出来
  card: [0.74, 0.805].map(m), // 场景卡片出现
  hl1: [0.81, 0.845].map(m),
  hl2: [0.845, 0.88].map(m),
  meaning: [0.89, 0.935].map(m),
};

export function ActOne() {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [canSplit, setCanSplit] = useState(false);
  const [inSea, setInSea] = useState(true);
  const [inHero, setInHero] = useState(true);
  useMotionValueEvent(p, "change", (v) => {
    setCanSplit(v > m(0.12) && v < m(0.27));
    setInSea(v < SEA * 1.05);
    setInHero(v < HERO * 1.2);
  });

  // 首屏：文案上移淡出，光带隐去，四张卡片汇入词海
  const heroOpacity = useTransform(p, [0.012, 0.05], [1, 0]);
  const heroY = useTransform(p, [0, 0.06], [0, -70]);
  const bandOpacity = useTransform(p, [0.02, HERO * 1.1], [1, 0]);
  const merge = useTransform(p, [0.012, HERO], [0, 1]);
  const home = useRef<HTMLDivElement>(null);

  // 词海的驱动量
  const spin = useTransform(p, [0.03, SEA], [0, 1]);
  const focus = useTransform(p, [sea(0.5), sea(0.84)], [0, 1]);
  const grow = useTransform(p, [sea(0.82), sea(0.98)], [0, 1]);
  const seaOpacity = useTransform(p, [SEA * 0.995, SEA * 1.03], [1, 0]);
  const wordOpacity = useTransform(p, [sea(0.96), SEA], [0, 1]);
  const seaGlow = useTransform(p, [0.03, HERO, sea(0.8), SEA], [0, 0.2, 0.2, 0]);
  const fog = useTransform(p, [HERO * 0.8, HERO, sea(0.88), sea(0.95)], [0, 1, 1, 0]);

  // 巨型单词此刻的字号：词海里的主角词要放大到和它一样大
  const stage = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const fontPx = useRef(140);
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const read = () => (fontPx.current = parseFloat(getComputedStyle(el).fontSize) || 140);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const glow = useTransform(p, [0.28, 0.4, 0.52, 0.72, 0.95].map(m), [0, 0.28, 0.5, 0.26, 0.14]);
  const glowScale = useTransform(p, [0.28, 0.52, 0.72].map(m), [0.6, 1.1, 0.8]);
  const rowY = useTransform(p, T.rise, ["0vh", "-29vh"]);
  // 手机上单词本来就小，上移时别缩得太狠
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const rowScale = useTransform(p, T.rise, [1, narrow ? 0.7 : 0.42]);

  // 刚亮相时的两处小注：头顶一道量尺标出"14 个字母"，脚下一行音标
  const notes = useTransform(p, [0.005, 0.03, 0.07, 0.092].map(m), [0, 1, 1, 0]);
  const cardOpacity = useTransform(p, T.card, [0, 1]);
  const cardY = useTransform(p, T.card, [70, 0]);
  const cardScale = useTransform(p, T.card, [0.94, 1]);
  const hl1 = useTransform(p, T.hl1, ["0% 100%", "100% 100%"]);
  const hl2 = useTransform(p, T.hl2, ["0% 100%", "100% 100%"]);
  const meaningOpacity = useTransform(p, T.meaning, [0, 1]);
  const meaningY = useTransform(p, T.meaning, [30, 0]);

  // "拆开它"：直接把页面送到翻面之前
  const split = () => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - window.innerHeight) * m(0.44);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top, { duration: 1.8 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  let li = 0;

  return (
    <section id="top" ref={track} className="relative h-[860svh] bg-white">
      {/* 导航和按钮跳到这里：词海刚成形的位置 */}
      <div id="sea" aria-hidden className="absolute" style={{ top: `calc((100% - 100svh) * ${HERO + 0.02})` }} />
      <div id="act-1" aria-hidden className="absolute" style={{ top: `calc((100% - 100svh) * ${SEA})` }} />

      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* 首屏的斜切光带 */}
        <motion.div
          className="absolute inset-x-0 -top-[14%] h-[62%] origin-top-left -skew-y-[8deg] overflow-hidden lg:h-[98%]"
          style={{ opacity: bandOpacity, visibility: inHero ? "visible" : "hidden" }}
        >
          <Gradient active={inHero} />
        </motion.div>
        <Guides />
        <HeroCopy ref={home} opacity={heroOpacity} y={heroY} live={inHero} />

        {/* 词海：单词牌组成的球 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div className="h-[60vh] w-[min(1200px,92vw)] rounded-full bg-flow blur-[130px]" style={{ opacity: seaGlow }} />
        </div>
        <motion.div
          className="absolute inset-0"
          style={{ opacity: seaOpacity, visibility: inSea ? "visible" : "hidden", pointerEvents: "none" }}
        >
          <WordSphere
            merge={merge}
            spin={spin}
            focus={focus}
            grow={grow}
            targetFontPx={() => fontPx.current}
            guests={GUESTS}
            home={() => home.current?.getBoundingClientRect() ?? null}
          />
        </motion.div>

        {/* 单词背后的一团渐变光晕。居中交给外层 flex，motion 的 transform 会覆盖掉 translate 类 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-[42vh] w-[min(1050px,86vw)] rounded-full bg-flow blur-[120px]"
            style={{ opacity: glow, scale: glowScale, y: rowY }}
          />
        </div>

        {/* 主角：这个单词 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1600px]">
          <motion.div
            ref={row}
            style={{ y: rowY, scale: rowScale, opacity: wordOpacity }}
            className="word relative flex items-center text-[clamp(2.4rem,10.2vw,9.5rem)] leading-none tracking-[-0.035em] [transform-style:preserve-3d]"
          >
            <motion.div aria-hidden style={{ opacity: notes }} className="pointer-events-none absolute inset-x-0 -top-[0.5em] font-display tracking-normal">
              <div className="h-[0.08em] rounded-t-[0.03em] border-x border-t border-navy/25" />
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] text-[0.105em] font-semibold text-navy-faint">
                14 个字母
              </span>
            </motion.div>
            <motion.div
              aria-hidden
              style={{ opacity: notes }}
              className="pointer-events-none absolute inset-x-0 top-[calc(100%+0.16em)] text-center font-display text-[0.115em] font-normal tracking-[0.02em] text-navy-faint"
            >
              /ˌkwɪntɪˈsenʃl/　adj.
            </motion.div>
            {SEGS.map((seg, si) => (
              <Tile key={seg.t} p={p} assoc={seg.assoc} zh={seg.zh} count={seg.t.length} lag={si * 0.035}>
                {seg.t.split("").map((ch) => {
                  const i = li++;
                  return (
                    <Letter key={i} p={p} to={SCATTER[i]}>
                      {ch}
                    </Letter>
                  );
                })}
              </Tile>
            ))}
          </motion.div>
        </div>

        {/* 记忆场景 + 词义 */}
        <div className="absolute inset-x-0 top-[34%] flex flex-col items-center px-6">
          <motion.div
            style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
            className="glass w-full max-w-[780px] px-7 py-6 sm:px-9 sm:py-8"
          >
            <div className="flex items-center gap-2.5 text-[12px] font-medium tracking-[0.1em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-flow" />
              记忆场景
            </div>
            <p className="mt-4 text-[clamp(1rem,1.5vw,1.3rem)] leading-[1.85] text-white/80">
              年轻的王室成员问老女王：成为女王的精髓是什么？女王没有直接回答，只是从容地为她倒了一杯茶，微笑着说：「优雅、沉着与仁慈，这些都是
              <motion.span className="hl-flow font-semibold text-white" style={{ backgroundSize: hl1 }}>
                女王的 (Queen’s)
              </motion.span>{" "}
              <motion.span className="hl-flow font-semibold text-white" style={{ backgroundSize: hl2 }}>
                必要 (essential)
              </motion.span>{" "}
              的品质。」
            </p>
          </motion.div>

          <motion.div style={{ opacity: meaningOpacity, y: meaningY }} className="mt-9 text-center">
            <p className="text-[14px] font-semibold tracking-[0.06em] text-navy-faint">
              所以 quintessential <span className="font-normal italic">adj.</span> 的意思是
            </p>
            <p className="head mt-2 text-[clamp(2rem,5vw,4.25rem)] leading-[1.15]">
              精髓的；<span className="bg-flow bg-clip-text text-transparent">典范的</span>
            </p>
          </motion.div>
        </div>

        {/* 牌和卡片之间的箭头 */}
        <Wires p={p} stage={stage} row={row} narrow={narrow} />

        {/* 旁白：随进度一句句换 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[8svh] px-6 text-center">
          <div className="relative mx-auto h-[5.5rem] max-w-[44rem]">
            {/* 旁白底下垫一团白雾，免得和飘过的词牌打架 */}
            <motion.div aria-hidden style={{ opacity: fog }} className="absolute -inset-x-16 -inset-y-8 rounded-[50%] bg-white/85 blur-2xl" />
            <ScrubCaption p={p} from={HERO + 0.012} to={sea(0.44)} title="要记的单词，有几千个" sub="先别慌，今天只记一个" />
            <ScrubCaption p={p} from={sea(0.52)} to={sea(0.9)} title="别的先放下" sub="就它了" />
            <ScrubCaption p={p} from={m(0)} to={m(0.085)} title="这是 quintessential" sub="14 个字母，看着就头大" />
            <ScrubCaption p={p} from={m(0.11)} to={m(0.255)} title="硬背，就是把 14 个字母塞进脑子" sub="塞得进去，留不住" />
            <ScrubCaption p={p} from={m(0.29)} to={m(0.44)} title="换个办法：先把它拆开" sub="14 个字母，其实就两块" />
            <ScrubCaption p={p} from={m(0.47)} to={m(0.6)} title="quint 听着像 Queen’s，essential 你本来就认识" sub="两块都是老熟人" />
            <ScrubCaption p={p} from={m(0.95)} to={1.1} title="你没有背它，你看懂了它" />
          </div>
        </div>

        <button
          type="button"
          onClick={split}
          tabIndex={canSplit ? 0 : -1}
          className="pill pill-navy absolute bottom-[3.2svh] left-1/2 h-10 -translate-x-1/2 px-5 text-[14px] transition-opacity duration-300"
          style={{ opacity: canSplit ? 1 : 0, pointerEvents: canSplit ? "auto" : "none" }}
        >
          拆开它 <span className="chev">→</span>
        </button>
      </div>
    </section>
  );
}

/**
 * 两块牌和记忆场景之间的箭头：一个宽而淡的向下箭头，告诉人"上面这两块，得出下面这一段"。
 * 只有一层很浅的渐变填色，没有描边。牌升到位之后它从上往下显出来，随后卡片浮现。
 * 位置由排版算出来（牌高、行的缩放和上移量、卡片上沿），窗口变了会重算。
 */
function Wires({
  p,
  stage,
  row,
  narrow,
}: {
  p: MotionValue<number>;
  stage: React.RefObject<HTMLDivElement | null>;
  row: React.RefObject<HTMLDivElement | null>;
  narrow: boolean;
}) {
  const [geo, setGeo] = useState<{ W: number; H: number; yb: number; ct: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const st = stage.current, r = row.current;
      const tile = r?.querySelector<HTMLElement>("[data-tile]");
      if (!st || !tile) return;
      const W = st.clientWidth, H = st.clientHeight;
      const s = narrow ? 0.7 : 0.42; // 行最终的缩放
      const cy = H / 2 - 0.29 * window.innerHeight; // 行上移 29vh
      setGeo({ W, H, yb: cy + (tile.offsetHeight / 2) * s, ct: 0.34 * H });
    };
    calc();
    window.addEventListener("resize", calc);
    document.fonts?.ready.then(calc);
    return () => window.removeEventListener("resize", calc);
  }, [stage, row, narrow]);

  const opacity = useTransform(p, T.wire, [0, 1]);
  const y = useTransform(p, T.wire, [-14, 0]);
  const clip = useTransform(p, T.wire, ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);

  if (!geo) return null;
  const { W, H, yb, ct } = geo;
  const top = yb + 13, bottom = ct - 13, h = bottom - top, cx = W / 2;
  if (h < 20) return null;
  // 比例跟着高度走：箭杆约占一半高，箭头宽约是箭杆的两倍多
  const shaft = h * 0.5, head = h * 1.12, neck = top + h * 0.44;
  // 一个胖胖的向下箭头：上半截是竖条，下半截是三角
  const d = `M ${cx - shaft} ${top} L ${cx + shaft} ${top} L ${cx + shaft} ${neck} L ${cx + head} ${neck} L ${cx} ${bottom} L ${cx - head} ${neck} L ${cx - shaft} ${neck} Z`;

  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      style={{ opacity, y, clipPath: clip }}
    >
      <defs>
        <linearGradient id="arrow-fill" gradientUnits="userSpaceOnUse" x1={cx - head} x2={cx + head} y1="0" y2="0">
          <stop offset="0" stopColor="rgb(var(--g1))" />
          <stop offset="0.5" stopColor="rgb(var(--g2))" />
          <stop offset="1" stopColor="rgb(var(--g3))" />
        </linearGradient>
        {/* 上淡下浓：箭头像是从牌底"渗"出来，越往下越实 */}
        <linearGradient id="arrow-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={top} y2={bottom}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="arrow-mask" maskUnits="userSpaceOnUse" x={cx - head - 12} y={top - 12} width={head * 2 + 24} height={h + 24}>
          <rect x={cx - head - 12} y={top - 12} width={head * 2 + 24} height={h + 24} fill="url(#arrow-fade)" />
        </mask>
      </defs>
      {/* 填色和描边都用不透明的同一个渐变，整体再压到很淡：这样圆角是磨出来的，边缘也不会叠出一圈深色 */}
      <g opacity="0.3" mask="url(#arrow-mask)">
        <path d={d} fill="url(#arrow-fill)" stroke="url(#arrow-fill)" strokeWidth="9" strokeLinejoin="round" />
      </g>
    </motion.svg>
  );
}

/** 单个字母：按自己的轨迹散开再收回 */
function Letter({ p, to, children }: { p: MotionValue<number>; to: [number, number, number]; children: ReactNode }) {
  const [ox, oy, rot] = to;
  const k = T.scatter;
  const x = useTransform(p, [...k], ["0vw", `${ox}vw`, `${ox * 1.06}vw`, "0vw"]);
  const y = useTransform(p, [...k], ["0vh", `${oy}vh`, `${oy * 1.06}vh`, "0vh"]);
  const rotate = useTransform(p, [...k], [0, rot, rot * 1.1, 0]);
  const opacity = useTransform(p, [...k], [1, 0.32, 0.32, 1]);
  const filter = useTransform(p, [...k], ["blur(0px)", "blur(2.5px)", "blur(2.5px)", "blur(0px)"]);
  return (
    <motion.span className="inline-block will-change-transform" style={{ x, y, rotate, opacity, filter }}>
      {children}
    </motion.span>
  );
}

/** 一块牌：正面是字母，背面是它对应的联想；先浮出牌面，再沿横轴翻过去 */
function Tile({
  p,
  assoc,
  zh,
  count,
  lag,
  children,
}: {
  p: MotionValue<number>;
  assoc: string;
  zh: string;
  /** 这一块有几个字母 */
  count: number;
  /** 翻面比前一块晚多少进度 */
  lag: number;
  children: ReactNode;
}) {
  // 拆成两块之后、翻面之前：每块头顶标一下各有几个字母
  const tally = useTransform(p, [0.4, 0.425, 0.445, 0.46].map(m), [0, 1, 1, 0]);
  // 牌面有内边距；一开始用负外边距抵消，单词看上去是连着的，之后才分开
  const margin = useTransform(p, T.tile, ["-0.2em", "0.07em"]);
  const plate = useTransform(p, T.tile, [0, 1]);
  const f0 = T.flip[0] + lag;
  const f1 = T.flip[1] + lag;
  const rotateX = useTransform(p, [f0, f1], [0, 180]);
  const lift = useTransform(p, [f0, (f0 + f1) / 2, f1], [0, 90, 0]);

  return (
    <motion.div
      data-tile
      className="relative [transform-style:preserve-3d]"
      style={{ marginInline: margin, rotateX, z: lift }}
    >
      <div className="relative px-[0.2em] py-[0.14em] [backface-visibility:hidden]">
        <motion.div
          aria-hidden
          style={{ opacity: plate }}
          className="glass glass-light absolute inset-0 !rounded-[0.14em]"
        />
        <span className="relative whitespace-nowrap">{children}</span>
        <motion.span
          aria-hidden
          style={{ opacity: tally }}
          className="pointer-events-none absolute inset-x-[0.2em] -top-[0.44em] block font-display tracking-normal"
        >
          <span className="block h-[0.07em] rounded-t-[0.03em] border-x border-t border-navy/25" />
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] text-[0.105em] font-semibold text-navy-faint">{count}</span>
        </motion.span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.12em] rounded-[0.14em] bg-flow text-white shadow-[0_30px_60px_-20px_rgb(var(--g2)/0.65),inset_0_1px_0_rgb(255_255_255/0.45),inset_0_0_0_1px_rgb(255_255_255/0.14)] [backface-visibility:hidden] [transform:rotateX(180deg)]">
        <span className="text-[0.5em] tracking-[-0.02em]">{assoc}</span>
        <span className="font-display text-[0.17em] font-semibold tracking-[0.12em] text-white/85">{zh}</span>
      </div>
    </motion.div>
  );
}
