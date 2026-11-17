"use client";

import { useEffect, useState } from "react";

/** 按时间点推进阶段：marks[i] 毫秒后进入阶段 i+1；loop 毫秒后从头再来 */
export function usePhase(active: boolean, marks: readonly number[], loop?: number) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active) {
      setPhase(0);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase(0);
      marks.forEach((ms, i) => timers.push(setTimeout(() => setPhase(i + 1), ms)));
      if (loop) timers.push(setTimeout(run, loop));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [active, marks, loop]);
  return phase;
}

/** 逐字输出，模拟流式回答 */
export function useTyped(text: string, on: boolean, charMs = 38) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) {
      setN(0);
      return;
    }
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), charMs);
    return () => clearInterval(id);
  }, [on, text, charMs]);
  return text.slice(0, n);
}
