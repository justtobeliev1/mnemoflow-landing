/**
 * disparate（迥然不同）：一张牌斜斜分成两半。左边是银行家的世界：深色细条纹上一条笔直的领带；
 * 右边是朋克乐手的世界：暖色里一把歪着的电吉他。一明一暗、一正一斜，却一样高、一样重。
 */
export default function DisparateArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="disparate-warm" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g3))" stopOpacity="0.9" />
          <stop offset="1" stopColor="rgb(var(--g4))" stopOpacity="0.92" />
        </linearGradient>
        <clipPath id="disparate-left">
          <path d="M0 0 H 178 L 122 800 H 0 Z" />
        </clipPath>
        <clipPath id="disparate-blade">
          <path d="M64 218 H 84 L 104 424 L 74 462 L 44 424 Z" />
        </clipPath>
      </defs>

      {/* 右半：暖色 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="800" fill="url(#disparate-warm)" />
      {/* 琴背后炸开的一团光：尖的，不是圆的 */}
      <path d="M329 418 L 293 436 L 305 475 L 265 472 L 256 511 L 223 489 L 196 519 L 178 483 L 139 495 L 142 455 L 103 446 L 125 413 L 95 386 L 131 368 L 119 329 L 159 332 L 168 293 L 201 315 L 228 285 L 246 321 L 285 309 L 282 349 L 321 358 L 299 391 Z" fill="#fff" opacity="0.22" />
      <path d="M286 433 L 259 439 L 260 466 L 234 458 L 222 481 L 204 461 L 181 476 L 175 449 L 148 450 L 156 424 L 133 412 L 153 394 L 138 371 L 165 365 L 164 338 L 190 346 L 202 323 L 220 343 L 243 328 L 249 355 L 276 354 L 268 380 L 291 392 L 271 410 Z" fill="#fff" opacity="0.3" />

      {/* 左半：深色细条纹 */}
      <path d="M0 0 H 178 L 122 800 H 0 Z" fill="rgb(var(--ink))" />
      <g clipPath="url(#disparate-left)" stroke="#fff" strokeOpacity="0.09" strokeWidth="2">
        <path d="M6 0 V 800 M38 0 V 800 M70 0 V 800 M102 0 V 800 M134 0 V 800 M166 0 V 800" />
      </g>

      {/* 领带：衣领、领结、带身和斜纹 */}
      <path d="M68 184 L 32 168 L 40 212 Z M80 184 L 116 168 L 108 212 Z" fill="#fff" opacity="0.3" />
      <path d="M68 184 L 32 168 L 40 212 Z M80 184 L 116 168 L 108 212 Z" fill="rgb(var(--g1) / 0.55)" />
      <path d="M57 182 H 91 L 85 212 H 63 Z" fill="#fff" />
      <path d="M64 218 H 84 L 104 424 L 74 462 L 44 424 Z" fill="#fff" />
      <g clipPath="url(#disparate-blade)" stroke="rgb(var(--g1))" strokeWidth="13">
        <path d="M30 262 L 120 222 M30 318 L 120 278 M30 374 L 120 334 M30 430 L 120 390 M30 486 L 120 446" />
      </g>

      {/* 电吉他：歪着放 */}
      <g transform="translate(226 356) rotate(12) scale(0.8)">
        <path
          d="M-12 0 C -16 -8, -22 -30, -40 -34 C -52 -36, -58 -22, -56 -6 C -54 12, -44 22, -46 44 C -48 66, -66 76, -64 104 C -62 138, -30 150, 0 150 C 34 150, 64 136, 64 102 C 64 78, 46 68, 44 46 C 42 28, 50 18, 50 4 C 50 -10, 44 -20, 34 -20 C 24 -20, 16 -8, 12 0 Z"
          fill="rgb(var(--ink))"
        />
        <rect x="-8" y="-172" width="16" height="180" fill="rgb(var(--ink))" />
        <path d="M-9 -166 L -16 -212 Q -17 -226 -3 -226 L 14 -220 Q 22 -217 20 -206 L 9 -166 Z" fill="rgb(var(--ink))" />
        <path d="M-23 -212 h10 M-21 -197 h10 M-19 -182 h10" stroke="rgb(var(--ink))" strokeWidth="7" strokeLinecap="round" />
        <path d="M0 -150 v0 M0 -116 v0 M0 -82 v0 M0 -48 v0" stroke="#fff" strokeOpacity="0.8" strokeWidth="6" strokeLinecap="round" />
        <rect x="-22" y="26" width="44" height="12" rx="4" fill="#fff" />
        <rect x="-22" y="58" width="44" height="12" rx="4" fill="#fff" />
        <rect x="-18" y="98" width="36" height="8" rx="3" fill="rgb(var(--g4))" />
        <circle cx="40" cy="98" r="6" fill="rgb(var(--g3))" />
        <circle cx="30" cy="122" r="6" fill="rgb(var(--g3))" />
      </g>
    </svg>
  );
}
