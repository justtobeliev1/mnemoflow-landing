import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "misans/lib/Normal/MiSansVF.min.css";
import "../styles/globals.css";
import { MotionProvider } from "@/components/v2/motion-provider";

export const metadata: Metadata = {
  title: "Mnemoflow · 这一页看完，你会记住一个词",
  description:
    "Mnemoflow 用 AI 为每个英语单词拆出一条讲得通的联想，把音、形、义连成一个场景，再用 FSRS 算法安排复习。",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
