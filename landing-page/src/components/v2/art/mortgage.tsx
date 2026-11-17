/**
 * mortgage（按揭，字面是“死契”）：夜里一栋亮着灯的小房子，被一把大得离谱的挂锁整个锁在锁梁里。
 * 房子站在锁身上，锁比房子大好几倍。
 */
export default function MortgageArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      {/* 夜 */}
      <rect width="300" height="800" fill="rgb(var(--ink))" />
      <circle cx="150" cy="350" r="176" fill="rgb(var(--g1))" opacity="0.1" />
      <circle cx="150" cy="350" r="124" fill="rgb(var(--g2))" opacity="0.14" />

      {/* 几颗星 */}
      <g fill="#fff">
        <circle cx="46" cy="118" r="2.5" opacity="0.8" />
        <circle cx="236" cy="92" r="2" opacity="0.6" />
        <circle cx="268" cy="188" r="3" opacity="0.85" />
        <circle cx="30" cy="262" r="2" opacity="0.5" />
        <circle cx="92" cy="176" r="1.5" opacity="0.6" />
        <circle cx="274" cy="402" r="2" opacity="0.45" />
        <circle cx="22" cy="430" r="2.5" opacity="0.6" />
      </g>

      {/* 地面 */}
      <path d="M0 514 Q 150 494 300 514 L 300 800 L 0 800 Z" fill="rgb(var(--ink))" />
      <path d="M0 514 Q 150 494 300 514 L 300 800 L 0 800 Z" fill="rgb(var(--g1) / 0.13)" />
      <ellipse cx="150" cy="510" rx="112" ry="8" fill="rgb(var(--ink) / 0.6)" />

      <g transform="translate(0 -22)">
        {/* 锁梁 */}
        <path d="M82 404 V 318 a68 68 0 0 1 136 0 V 404" fill="none" stroke="rgb(var(--g2))" strokeWidth="26" />
        <path d="M77 396 V 318 a73 73 0 0 1 60 -72" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />

        {/* 小房子，站在锁身上 */}
        <rect x="166" y="302" width="12" height="30" fill="rgb(var(--g3))" />
        <path d="M105 346 L 150 298 L 195 346 Z" fill="rgb(var(--g3))" />
        <rect x="114" y="344" width="72" height="54" fill="#fff" />
        <rect x="124" y="358" width="20" height="20" rx="2" fill="rgb(var(--g4))" />
        <path d="M156 398 V 370 a9 9 0 0 1 18 0 V 398 Z" fill="rgb(var(--ink))" />

        {/* 锁身 */}
        <rect x="50" y="396" width="200" height="134" rx="24" fill="rgb(var(--g4))" />
        <path d="M50 492 H 250 V 506 a24 24 0 0 1 -24 24 H 74 a24 24 0 0 1 -24 -24 Z" fill="rgb(var(--g3) / 0.5)" />
        {/* 锁孔 */}
        <circle cx="150" cy="442" r="15" fill="rgb(var(--ink))" />
        <path d="M143 450 L 137 484 H 163 L 157 450 Z" fill="rgb(var(--ink))" />
      </g>
    </svg>
  );
}
