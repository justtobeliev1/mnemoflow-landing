/**
 * candid（坦率）：安静的屋子里，一排排背影当中，只有一只手举了起来。
 */

/** 一个背影：圆的头 + 溜肩，一直铺到画布底。几个背影拼成一条路径，整排一个颜色。 */
function row(xs: number[], cy: number, r: number, w: number) {
  const t = cy + r - 6;
  return xs
    .map(
      (cx) =>
        `M${cx - r} ${cy} a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 ${-2 * r} 0 Z ` +
        `M${cx - w} 800 V${t + 38} C${cx - w} ${t + 10} ${cx - w * 0.5} ${t} ${cx} ${t} C${cx + w * 0.5} ${t} ${cx + w} ${t + 10} ${cx + w} ${t + 38} V800 Z`,
    )
    .join(" ");
}

export default function CandidArt() {
  const back = row([34, 130, 262], 468, 20, 52);
  const middle = row([-12, 112, 238], 514, 25, 66);
  const front = row([46, 222], 574, 31, 90);

  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="candid-room" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g3))" stopOpacity="0.8" />
          <stop offset="0.7" stopColor="rgb(var(--g2))" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* 屋子 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="800" fill="url(#candid-room)" />

      {/* 举手的地方亮一点 */}
      <circle cx="190" cy="290" r="140" fill="#fff" opacity="0.13" />
      <circle cx="190" cy="290" r="92" fill="#fff" opacity="0.16" />

      {/* 最后一排 */}
      <path d={back} fill="rgb(var(--g2))" />
      <path d={back} fill="rgb(var(--ink) / 0.14)" />

      {/* 举起来的那只手：袖子、手腕、手掌、五指 */}
      <g transform="translate(176 384) rotate(4)">
        <path d="M-28 74 L -35 300 H 35 L 28 74 Z" fill="#fff" />
        <rect x="-31" y="58" width="62" height="22" rx="7" fill="#fff" />
        <rect x="-21" y="-12" width="42" height="76" fill="#fff" />
        <rect x="-36" y="-84" width="72" height="96" rx="26" fill="#fff" />
        <g stroke="#fff" strokeLinecap="round" fill="none">
          <path d="M-26 -66 L -34 -144 M-9 -66 L -10 -160 M9 -66 L 13 -152 M26 -62 L 36 -126" strokeWidth="16" />
          <path d="M-24 -32 L -56 -70" strokeWidth="18" />
        </g>
      </g>

      {/* 中间一排：举手的人就坐在这里 */}
      <path d={middle} fill="rgb(var(--g2))" />
      <path d={middle} fill="rgb(var(--ink) / 0.36)" />

      {/* 最前一排，压住下面三分之一 */}
      <path d={front} fill="rgb(var(--g2))" />
      <path d={front} fill="rgb(var(--ink) / 0.7)" />
    </svg>
  );
}
