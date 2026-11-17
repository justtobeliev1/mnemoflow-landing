/**
 * bargain（划算）：吧台上一瓶酒，瓶颈挂着一张价签，原来的价钱被一道斜线划掉，
 * 底下换成了更短的一条。头顶一盏吊灯。
 */
export default function BargainArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="bargain-wall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g4))" stopOpacity="0.9" />
          <stop offset="1" stopColor="rgb(var(--g3))" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* 墙 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="540" fill="url(#bargain-wall)" />

      {/* 后面的酒架，淡淡的几只瓶子 */}
      <g fill="#fff" opacity="0.26">
        <rect x="0" y="212" width="92" height="7" rx="3.5" />
        <path d="M10 212 V 170 Q 10 160 16 156 V 138 H 24 V 156 Q 30 160 30 170 V 212 Z" />
        <path d="M40 212 V 180 Q 40 172 46 168 V 154 H 54 V 168 Q 60 172 60 180 V 212 Z" />
      </g>

      {/* 吊灯和灯光 */}
      <path d="M176 152 H 240 L 344 522 H 40 Z" fill="#fff" opacity="0.16" />
      <path d="M208 0 V 112" stroke="rgb(var(--ink))" strokeWidth="2.5" />
      <circle cx="208" cy="154" r="12" fill="#fff" />
      <path d="M170 154 C 170 124, 190 108, 208 108 C 226 108, 246 124, 246 154 Z" fill="rgb(var(--ink))" />

      {/* 酒瓶 */}
      <path d="M98 522 V 382 C 98 346, 117 340, 117 302 V 262 H 139 V 302 C 139 340, 158 346, 158 382 V 522 Z" fill="rgb(var(--g1))" />
      <path d="M109 372 V 508" stroke="#fff" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" />
      <rect x="98" y="412" width="60" height="62" fill="rgb(var(--ink))" />
      <circle cx="128" cy="443" r="10" fill="rgb(var(--g4))" />
      <rect x="114" y="238" width="28" height="42" rx="5" fill="rgb(var(--ink))" />

      {/* 价签：绳子绕在瓶颈上 */}
      <path d="M116 294 H 140 C 164 296, 184 306, 199 338" stroke="rgb(var(--ink))" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <g transform="translate(200 340) rotate(9)">
        <path d="M0 -18 L 26 4 V 86 a8 8 0 0 1 -8 8 H -18 a8 8 0 0 1 -8 -8 V 4 Z" fill="#fff" />
        <circle cx="0" cy="2" r="5" fill="rgb(var(--g3))" />
        {/* 旧价：一条长杠，被划掉 */}
        <path d="M-13 40 H 13" stroke="rgb(var(--ink) / 0.3)" strokeWidth="10" strokeLinecap="round" />
        <path d="M-18 54 L 18 26" stroke="rgb(var(--g3))" strokeWidth="5" strokeLinecap="round" />
        {/* 新价：短一截 */}
        <path d="M-13 70 H 1" stroke="rgb(var(--g3))" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* 吧台：台面和正面 */}
      <rect y="552" width="300" height="248" fill="rgb(var(--ink))" />
      <rect y="552" width="300" height="248" fill="rgb(var(--g1) / 0.14)" />
      <rect y="520" width="300" height="34" fill="rgb(var(--ink))" />
      <rect y="520" width="300" height="6" fill="#fff" opacity="0.1" />
      {/* 灯光落在台面上的那一段 */}
      <rect x="40" y="520" width="260" height="6" fill="rgb(var(--g4) / 0.3)" />
    </svg>
  );
}
