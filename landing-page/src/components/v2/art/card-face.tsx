import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 一张词牌的正面：整幅插画铺底，单词像书脊一样竖排在左下，顶上一个挂孔。
 * 卡片比例固定 3:8（插画的画布是 300×800）。里面的尺寸都用容器宽度的百分比，卡片多大都等比。
 */
export function CardFace({
  word,
  tone,
  children,
  className,
}: {
  word: string;
  /** 竖排单词的颜色：插画下半部偏深用 light（白字），偏浅用 dark（深字） */
  tone: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[3/8] overflow-hidden rounded-[8%/3%] [container-type:inline-size]", className)}>
      <div className="absolute inset-0">{children}</div>

      {/* 竖排的单词 */}
      <span
        className={cn(
          "word absolute bottom-[14cqw] left-[9cqw] text-[17cqw] leading-none tracking-[-0.02em] [writing-mode:vertical-rl]",
          tone === "light" ? "text-white" : "text-navy",
        )}
        style={tone === "light" ? { textShadow: "0 0.5cqw 3cqw rgb(var(--ink) / 0.35)" } : undefined}
      >
        {word}
      </span>

      {/* 挂孔 */}
      <span
        aria-hidden
        className="absolute left-1/2 top-[8cqw] h-[8cqw] w-[8cqw] -translate-x-1/2 rounded-full bg-white shadow-[inset_0_0.6cqw_1.4cqw_rgb(var(--ink)/0.45),0_0_0_0.7cqw_rgb(255_255_255/0.35)]"
      />
      {/* 边缘的一圈受光 */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4),inset_0_1.5px_0_rgb(255_255_255/0.75)]" />
    </div>
  );
}
