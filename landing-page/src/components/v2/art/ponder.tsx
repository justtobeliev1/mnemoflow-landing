/**
 * ponder（沉思）：傍晚的池塘，岸上一把空椅子，一根鱼竿伸向水面。
 *
 * 这幅是整套词牌插画的画风样板：
 *   · 画布 300×800，铺满，不留白边；
 *   · 扁平的几何形，一幅只有一个主体（这里是椅子和鱼竿），放在画面中上部；
 *   · 下面三分之一留得安静，竖排的单词要压在那里；
 *   · 颜色只用当前天色的四个色标和文字色（CSS 变量），外加白：换天色时整幅画跟着变；
 *   · 所有 id 都带上单词前缀，一页里同时有十幅，不能重名。
 */
export default function PonderArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ponder-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g2))" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="rgb(var(--g3))" stopOpacity="0.42" />
          <stop offset="1" stopColor="rgb(var(--g4))" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="ponder-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g1))" stopOpacity="0.82" />
          <stop offset="1" stopColor="rgb(var(--g2))" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* 天 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="540" fill="url(#ponder-sky)" />

      {/* 落日和它的光晕 */}
      <circle cx="208" cy="228" r="96" fill="#fff" opacity="0.28" />
      <circle cx="208" cy="228" r="60" fill="#fff" opacity="0.45" />
      <circle cx="208" cy="228" r="38" fill="#fff" opacity="0.95" />

      {/* 远山，两层 */}
      <path d="M0 438 C 52 396, 104 404, 150 426 S 250 392, 300 418 L 300 540 L 0 540 Z" fill="rgb(var(--g2) / 0.4)" />
      <path d="M0 474 C 70 448, 140 470, 208 458 S 280 446, 300 452 L 300 540 L 0 540 Z" fill="rgb(var(--g1) / 0.5)" />

      {/* 水面 */}
      <rect y="528" width="300" height="272" fill="#fff" />
      <rect y="528" width="300" height="272" fill="url(#ponder-water)" />
      {/* 落日在水里的一道倒影 */}
      <path d="M186 548 h44 M178 566 h60 M190 584 h36 M196 602 h24" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />

      {/* 岸：一块探进水里的深色平台 */}
      <path d="M0 512 L 150 512 Q 164 512 164 526 L 164 532 Q 164 540 156 540 L 0 540 Z" fill="rgb(var(--ink))" />

      {/* 空椅子 */}
      <g stroke="rgb(var(--ink))" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M58 512 V 404" />
        <path d="M58 466 H 110 V 512" />
        <path d="M58 404 Q 64 398 70 404" />
      </g>

      {/* 鱼竿、鱼线、浮漂 */}
      <path d="M100 462 Q 170 420 246 372" stroke="rgb(var(--ink))" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M246 372 V 636" stroke="rgb(var(--ink) / 0.55)" strokeWidth="1.5" />
      <ellipse cx="246" cy="648" rx="20" ry="6" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
      <ellipse cx="246" cy="648" rx="38" ry="11" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="246" cy="648" rx="58" ry="17" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="246" cy="640" r="8" fill="rgb(var(--g4))" />
      <circle cx="246" cy="637" r="8" fill="#fff" />
      <path d="M238 637 a8 8 0 0 0 16 0 Z" fill="rgb(var(--g3))" />

      {/* 岸边几根芦苇 */}
      <g stroke="rgb(var(--ink) / 0.75)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M22 512 Q 18 470 26 436" />
        <path d="M34 512 Q 36 478 30 452" />
      </g>
      <ellipse cx="27" cy="430" rx="5" ry="12" fill="rgb(var(--ink))" />
      <ellipse cx="29" cy="446" rx="4" ry="10" fill="rgb(var(--ink) / 0.8)" />
    </svg>
  );
}
