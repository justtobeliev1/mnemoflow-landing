/**
 * resilient（有韧性）：大风里的三竿竹子。最粗的一竿被压成一张弓，旁边一竿正往回弹。
 * 竿子上的细缝是竹节，叶子全朝下风口飘。
 */
const LEAF = "M0 0 C 14 -10, 40 -7, 64 0 C 40 5, 14 7, 0 0 Z";

const G1 = "rgb(var(--g1))";
const G2 = "rgb(var(--g2))";
const INK = "rgb(var(--ink))";

/** [x, y, 朝向（180 = 正左）, 缩放, 颜色] */
const LEAVES: [number, number, number, number, string][] = [
  // 弯成弓的那竿：梢头
  [88, 272, 146, 0.85, G1],
  [84, 270, 174, 1.05, G1],
  [88, 268, 204, 0.8, INK],
  // 它的两处竹节
  [149, 290, 196, 0.9, G1],
  [149, 290, 226, 0.8, INK],
  [188, 360, 168, 0.85, G1],
  [188, 358, 196, 0.75, G1],
  // 往回弹的那竿
  [172, 180, 176, 0.85, G2],
  [172, 180, 206, 1.0, G2],
  [172, 180, 238, 0.8, INK],
  [207, 272, 208, 0.75, G2],
  // 矮的那竿
  [160, 426, 172, 0.7, G2],
  [160, 425, 202, 0.75, INK],
  // 被吹走的
  [62, 398, 192, 0.5, G1],
  [40, 196, 164, 0.42, G2],
];

export default function ResilientArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="resilient-air" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g1))" stopOpacity="0.36" />
          <stop offset="0.7" stopColor="rgb(var(--g1))" stopOpacity="0.14" />
          <stop offset="1" stopColor="rgb(var(--g1))" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="800" fill="url(#resilient-air)" />

      {/* 一轮淡淡的日头 */}
      <circle cx="168" cy="306" r="134" fill="#fff" opacity="0.4" />
      <circle cx="168" cy="306" r="88" fill="#fff" opacity="0.75" />

      {/* 风，从右往左 */}
      <g fill="none" stroke={G1} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round">
        <path d="M310 232 C 280 222, 262 240, 232 230" />
        <path d="M310 420 C 286 410, 268 426, 246 418" />
        <path d="M128 214 C 96 204, 70 224, 20 210" />
        <path d="M112 470 C 84 462, 60 478, -10 464" />
        <path d="M70 330 C 52 324, 36 336, 14 330" />
      </g>

      {/* 三竿竹子：细缝是竹节 */}
      <g fill="none" strokeLinecap="butt">
        <path d="M184 574 C 184 520, 178 472, 160 426" stroke={G2} strokeOpacity="0.7" strokeWidth="8" strokeDasharray="38 3" />
        <path d="M238 574 C 240 440, 228 300, 172 180" stroke={G2} strokeWidth="12" strokeDasharray="54 4" />
        <path d="M210 574 C 212 420, 190 262, 84 270" stroke={G1} strokeWidth="16" strokeDasharray="60 4" />
      </g>

      {/* 地 */}
      <path d="M0 566 C 90 556, 210 556, 300 568 L 300 800 L 0 800 Z" fill="#fff" />
      <path d="M0 566 C 90 556, 210 556, 300 568 L 300 800 L 0 800 Z" fill="rgb(var(--g1) / 0.16)" />

      {/* 叶子 */}
      {LEAVES.map(([x, y, r, s, fill], i) => (
        <path key={i} d={LEAF} fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
      ))}
    </svg>
  );
}
