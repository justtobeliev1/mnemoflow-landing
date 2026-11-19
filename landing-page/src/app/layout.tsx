import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "misans/lib/Normal/MiSansVF.min.css";
import "../styles/globals.css";
import { MotionProvider } from "@/components/v2/motion-provider";

const TITLE = "Mnemoflow · 背单词，有更好的办法";
const DESCRIPTION = "Mnemoflow 用 AI 为每个英语单词拆出一条讲得通的联想，把音、形、义连成一个场景，再用 FSRS 算法安排复习。";

export const metadata: Metadata = {
  // 分享预览图（同目录的 opengraph-image.png）要用完整网址，这里是线上的正式域名
  metadataBase: new URL("https://www.mnemoflow.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", url: "/", siteName: "Mnemoflow", locale: "zh_CN", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
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
