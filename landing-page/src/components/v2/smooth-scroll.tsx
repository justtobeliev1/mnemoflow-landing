"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** 全页平滑滚动。滚动驱动的动画都挂在原生 scroll 上，Lenis 只负责让滚轮变顺。 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
    // 页面里的"跳到某一步"按钮要用它来滚，否则会和平滑滚动打架
    const w = window as unknown as { __lenis?: Lenis };
    w.__lenis = lenis;
    return () => {
      delete w.__lenis;
      lenis.destroy();
    };
  }, []);
  return null;
}
