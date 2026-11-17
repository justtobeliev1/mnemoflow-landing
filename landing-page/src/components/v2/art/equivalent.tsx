/**
 * equivalent（等价的）：一架天平，左盘一台相机，右盘一块手表，横梁纹丝不动地平着。
 */
export default function EquivalentArt() {
  return (
    <svg viewBox="0 0 300 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="equivalent-air" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g1))" stopOpacity="0.36" />
          <stop offset="1" stopColor="rgb(var(--g2))" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="equivalent-table" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--g1))" stopOpacity="0.2" />
          <stop offset="1" stopColor="rgb(var(--g2))" stopOpacity="0.38" />
        </linearGradient>
      </defs>

      {/* 墙、墙上的一团光、桌面 */}
      <rect width="300" height="800" fill="#fff" />
      <rect width="300" height="520" fill="url(#equivalent-air)" />
      <circle cx="150" cy="312" r="152" fill="#fff" opacity="0.4" />
      <circle cx="150" cy="312" r="108" fill="#fff" opacity="0.5" />
      <rect y="520" width="300" height="280" fill="url(#equivalent-table)" />
      <ellipse cx="150" cy="521" rx="70" ry="6" fill="rgb(var(--ink) / 0.14)" />

      {/* 吊线 */}
      <path d="M70 216 L 26 400 M70 216 L 114 400 M230 216 L 186 400 M230 216 L 274 400" stroke="rgb(var(--ink))" strokeWidth="2.5" strokeLinecap="round" />

      {/* 相机 */}
      <rect x="54" y="332" width="32" height="20" rx="6" fill="rgb(var(--g1))" />
      <rect x="90" y="337" width="13" height="9" rx="3" fill="rgb(var(--g4))" />
      <rect x="30" y="344" width="80" height="55" rx="10" fill="rgb(var(--g1))" />
      <circle cx="70" cy="372" r="20" fill="#fff" />
      <circle cx="70" cy="372" r="13" fill="rgb(var(--ink))" />
      <circle cx="65.5" cy="367.5" r="3.6" fill="#fff" opacity="0.85" />
      <circle cx="41" cy="355" r="3.5" fill="#fff" />

      {/* 手表 */}
      <rect x="217" y="314" width="26" height="85" rx="6" fill="#fff" />
      <rect x="217" y="314" width="26" height="85" rx="6" fill="rgb(var(--g3) / 0.6)" />
      <rect x="254" y="350" width="9" height="12" rx="3" fill="rgb(var(--g4))" />
      <circle cx="230" cy="356" r="28" fill="rgb(var(--g3))" />
      <circle cx="230" cy="356" r="20" fill="#fff" />
      <path d="M230 343 V 356 L 239 361" stroke="rgb(var(--ink))" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* 天平：两只盘、立柱、底座、横梁 */}
      <path d="M22 398 H 118 A 48 18 0 0 1 22 398 Z M182 398 H 278 A 48 18 0 0 1 182 398 Z" fill="rgb(var(--ink))" />
      <rect x="145.5" y="190" width="9" height="312" fill="rgb(var(--ink))" />
      <path d="M92 521 Q 92 498 116 498 H 184 Q 208 498 208 521 Z" fill="rgb(var(--ink))" />
      <path d="M64 216 H 236" stroke="rgb(var(--ink))" strokeWidth="9" strokeLinecap="round" />
      <circle cx="150" cy="216" r="14" fill="rgb(var(--ink))" />
      <circle cx="150" cy="216" r="6" fill="rgb(var(--g4))" />
      <circle cx="150" cy="188" r="7" fill="rgb(var(--ink))" />
    </svg>
  );
}
