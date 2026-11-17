/**
 * meticulous（一丝不苟）：一块写字板，纸上的清单每一格都打了勾，
 * 铅笔的笔尖刚好停在最后一个勾上。
 */
export default function MeticulousArt() {
  // 清单的五行：y 是行的中线，w 是那一行横线的长度
  const rows = [
    { y: 270, w: 88 },
    { y: 308, w: 66 },
    { y: 346, w: 92 },
    { y: 384, w: 58 },
    { y: 422, w: 78 },
  ];

  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="meticulous-desk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g4))" stopOpacity="0.4" />
          <stop offset="0.55" stopColor="rgb(var(--g3))" stopOpacity="0.3" />
          <stop offset="1" stopColor="rgb(var(--g3))" stopOpacity="0.36" />
        </linearGradient>
      </defs>

      {/* 桌面 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="800" fill="url(#meticulous-desk)" />

      {/* 落在桌上的一团光 */}
      <circle cx="184" cy="282" r="190" fill="#fff" opacity="0.3" />
      <circle cx="184" cy="282" r="132" fill="#fff" opacity="0.4" />

      <g transform="translate(8 -20) rotate(-4 150 320)">
        {/* 写字板和它的影子 */}
        <rect x="64" y="190" width="188" height="292" rx="18" fill="rgb(var(--ink) / 0.1)" />
        <rect x="56" y="178" width="188" height="292" rx="18" fill="rgb(var(--ink))" />
        <rect x="70" y="200" width="160" height="256" rx="6" fill="#fff" />

        {/* 夹子 */}
        <rect x="130" y="158" width="40" height="30" rx="12" fill="rgb(var(--g1))" />
        <rect x="108" y="174" width="84" height="36" rx="10" fill="rgb(var(--g1))" />
        <circle cx="150" cy="172" r="6" fill="#fff" opacity="0.9" />

        {/* 标题 */}
        <path d="M88 234 H 148" stroke="rgb(var(--ink) / 0.6)" strokeWidth="9" strokeLinecap="round" />

        {/* 每一行：打了勾的方格 + 一条横线 */}
        {rows.map(({ y, w }) => (
          <g key={y}>
            <rect x="86" y={y - 12} width="24" height="24" rx="7" fill="rgb(var(--g2))" />
            <path d={`M92 ${y + 0.5} l 4.5 5 l 9.5 -11`} stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={`M124 ${y} h ${w}`} stroke="rgb(var(--ink) / 0.16)" strokeWidth="8" strokeLinecap="round" />
          </g>
        ))}

        {/* 铅笔：笔尖落在最后一个勾的末端 */}
        <g transform="translate(108 417) rotate(-30)">
          <rect x="-9" y="26" width="18" height="128" fill="rgb(var(--g4))" />
          <rect x="-3" y="26" width="6" height="128" fill="#fff" opacity="0.35" />
          <path d="M-9 26 L -3.5 8 H 3.5 L 9 26 Z" fill="#fff" />
          <path d="M-9 26 L -3.5 8 H 3.5 L 9 26 Z" fill="rgb(var(--g4) / 0.35)" />
          <path d="M-3.5 8 L 0 0 L 3.5 8 Z" fill="rgb(var(--ink))" />
          <rect x="-9" y="154" width="18" height="12" fill="rgb(var(--ink))" />
          <path d="M-9 166 H 9 V 178 a9 9 0 0 1 -18 0 Z" fill="rgb(var(--g3))" />
        </g>
      </g>
    </svg>
  );
}
