"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** 系统开了"减少动态效果"时，framer-motion 的位移类动画自动关掉 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
