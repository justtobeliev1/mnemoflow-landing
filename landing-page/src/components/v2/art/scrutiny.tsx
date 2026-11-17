/**
 * scrutiny（细察）：深色工作台上一块小盖板，四角各一颗小螺丝；
 * 放大镜悬在左上那颗的上方，镜片里它被放得很大，十字槽看得一清二楚。
 */
export default function ScrutinyArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="scrutiny-bench" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.3" />
          <stop offset="0.55" stopColor="rgb(var(--g1))" stopOpacity="0.08" />
          <stop offset="1" stopColor="rgb(var(--g1))" stopOpacity="0.26" />
        </linearGradient>
        <clipPath id="scrutiny-lens">
          <circle cx="112" cy="296" r="86" />
        </clipPath>
      </defs>

      {/* 工作台 */}
      <rect width="300" height="800" fill="rgb(var(--ink))" />
      <rect width="300" height="800" fill="url(#scrutiny-bench)" />
      {/* 台灯打下来的一圈光 */}
      <circle cx="150" cy="366" r="212" fill="#fff" opacity="0.035" />
      <circle cx="150" cy="366" r="150" fill="#fff" opacity="0.04" />

      {/* 盖板和上面的散热槽 */}
      <rect x="48" y="236" width="204" height="268" rx="26" fill="#fff" opacity="0.08" />
      <rect x="48" y="236" width="204" height="268" rx="26" fill="rgb(var(--g1) / 0.3)" />
      <path d="M112 426 h76 M112 446 h76 M112 466 h76" stroke="rgb(var(--ink) / 0.5)" strokeWidth="7" strokeLinecap="round" />

      {/* 另外三颗螺丝：真实大小 */}
      {[
        [222, 266],
        [78, 474],
        [222, 474],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="7" fill="rgb(var(--g4))" />
          <path d={`M${x - 3.5} ${y - 1.5} l7 3 M${x - 1.5} ${y + 3.5} l3 -7`} stroke="rgb(var(--ink))" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}

      {/* 放大镜落在盖板上的影子 */}
      <circle cx="122" cy="312" r="90" fill="rgb(var(--ink) / 0.34)" />
      <path d="M190 380 L 266 456" stroke="rgb(var(--ink) / 0.34)" strokeWidth="21" strokeLinecap="round" />

      {/* 镜片里：放大的盖板一角和那颗螺丝 */}
      <g clipPath="url(#scrutiny-lens)">
        <rect x="20" y="200" width="190" height="190" fill="rgb(var(--ink))" />
        <rect x="20" y="200" width="190" height="190" fill="rgb(var(--g1) / 0.2)" />
        <rect x="54" y="238" width="300" height="300" rx="84" fill="#fff" opacity="0.14" />
        <rect x="54" y="238" width="300" height="300" rx="84" fill="rgb(var(--g1) / 0.5)" />
        <circle cx="123" cy="311" r="44" fill="rgb(var(--ink) / 0.3)" />
        <circle cx="120" cy="304" r="42" fill="rgb(var(--g4))" />
        <circle cx="120" cy="304" r="31" fill="#fff" opacity="0.22" />
        <g transform="rotate(24 120 304)" fill="rgb(var(--ink))">
          <rect x="93" y="298.5" width="54" height="11" rx="4.5" />
          <rect x="114.5" y="277" width="11" height="54" rx="4.5" />
        </g>
      </g>

      {/* 镜框、反光、手柄 */}
      <circle cx="112" cy="296" r="86" fill="none" stroke="#fff" strokeWidth="9" />
      <path d="M43 284 A 70 70 0 0 1 86 231" stroke="#fff" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M174 358 L 194 378" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      <path d="M200 384 L 258 442" stroke="#fff" strokeWidth="21" strokeLinecap="round" />
      <path d="M196 380 L 207 391" stroke="rgb(var(--g4))" strokeWidth="21" />
    </svg>
  );
}
