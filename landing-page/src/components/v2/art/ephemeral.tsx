/**
 * ephemeral（朝生暮死）：黄昏的河面上，一只蜉蝣逆着落日飞过。
 * 翅膀半透明，三根尾丝拖得很长；太阳已经沉进对岸一半，水面只剩几圈涟漪。
 */
export default function EphemeralArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ephemeral-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="rgb(var(--g3))" stopOpacity="0.85" />
          <stop offset="1" stopColor="rgb(var(--g4))" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ephemeral-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.94" />
          <stop offset="1" stopColor="rgb(var(--g1))" stopOpacity="0.96" />
        </linearGradient>
        <linearGradient id="ephemeral-deep" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--ink))" stopOpacity="0.1" />
          <stop offset="1" stopColor="rgb(var(--ink))" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* 暮色的天 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="512" fill="url(#ephemeral-sky)" />

      {/* 快要落下去的太阳 */}
      <circle cx="192" cy="468" r="130" fill="#fff" opacity="0.14" />
      <circle cx="192" cy="468" r="86" fill="#fff" opacity="0.24" />
      <circle cx="192" cy="468" r="50" fill="#fff" opacity="0.96" />

      {/* 对岸，两层（先垫一层实色，免得太阳透出来） */}
      <path d="M0 460 C 50 444, 100 474, 150 484 S 250 470, 300 456 L 300 512 L 0 512 Z" fill="#fff" />
      <path d="M0 460 C 50 444, 100 474, 150 484 S 250 470, 300 456 L 300 512 L 0 512 Z" fill="rgb(var(--g2) / 0.85)" />
      <path d="M0 488 C 60 478, 110 497, 170 495 S 260 486, 300 491 L 300 512 L 0 512 Z" fill="rgb(var(--ink) / 0.5)" />

      {/* 河 */}
      <rect y="502" width="300" height="298" fill="#fff" />
      <rect y="502" width="300" height="298" fill="url(#ephemeral-water)" />
      <rect y="502" width="300" height="298" fill="url(#ephemeral-deep)" />
      {/* 落日的倒影 */}
      <path d="M166 522 h52 M156 540 h72 M172 558 h40 M182 576 h20" stroke="rgb(var(--g4))" strokeOpacity="0.92" strokeWidth="5" strokeLinecap="round" />
      {/* 点过水留下的涟漪 */}
      <g fill="none" stroke="#fff" strokeWidth="2">
        <ellipse cx="212" cy="664" rx="16" ry="5" strokeOpacity="0.75" />
        <ellipse cx="212" cy="664" rx="36" ry="11" strokeOpacity="0.4" />
        <ellipse cx="212" cy="664" rx="60" ry="18" strokeOpacity="0.2" />
      </g>

      {/* 蜉蝣 */}
      <g transform="translate(-18 -22)">
        {/* 尾丝 */}
        <g stroke="rgb(var(--ink))" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M225 306 C 248 286, 266 246, 268 180" />
          <path d="M225 306 C 256 294, 282 262, 294 214" />
          <path d="M225 306 C 258 308, 286 296, 304 268" />
        </g>
        {/* 远侧的翅 */}
        <path d="M128 338 C 126 284, 150 220, 202 182 C 216 230, 198 300, 138 342 Z" fill="#fff" opacity="0.4" />
        {/* 后翅 */}
        <path d="M134 338 C 152 310, 182 298, 198 302 C 194 324, 166 340, 136 344 Z" fill="#fff" opacity="0.52" />
        {/* 近侧的翅 */}
        <path d="M118 340 C 90 288, 102 212, 146 168 C 178 206, 178 290, 132 342 Z" fill="#fff" opacity="0.8" />
        <g stroke="rgb(var(--g2))" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M124 336 C 118 282, 126 224, 146 182" />
          <path d="M127 336 C 138 292, 152 258, 163 230" />
          <path d="M129 338 C 146 312, 158 294, 167 272" />
        </g>
        {/* 身体：头、胸、往上翘的腹 */}
        <path d="M130 334 C 166 342, 200 334, 222 302 L 229 307 C 212 346, 170 364, 130 360 Z" fill="rgb(var(--ink))" />
        <ellipse cx="122" cy="347" rx="21" ry="14" fill="rgb(var(--ink))" />
        <circle cx="97" cy="353" r="9.5" fill="rgb(var(--ink))" />
        <path d="M152 341 l-2 18 M171 341 l0 15 M189 335 l3 12" stroke="rgb(var(--g4))" strokeWidth="2" strokeLinecap="round" />
        {/* 腿 */}
        <g stroke="rgb(var(--ink))" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M110 357 Q 90 380 66 370" />
          <path d="M124 360 Q 126 378 142 384" />
        </g>
      </g>
    </svg>
  );
}
