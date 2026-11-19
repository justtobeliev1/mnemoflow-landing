import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "misans/lib/Normal/MiSansVF.min.css";
import "../styles/globals.css";
import { MotionProvider } from "@/components/v2/motion-provider";

const TITLE = "Mnemoflow · 背单词，有更好的办法";
// 搜索结果里标题下面的那段话：给直接搜 Mnemoflow 的人看，先讲清楚这是个什么东西
const DESCRIPTION = "Mnemoflow 是一款 AI 背单词应用。它把每个英语单词拆开，用谐音、词根或一个小故事讲明白，再按遗忘规律安排复习，帮你把单词真正记住。";
const SITE = "https://www.mnemoflow.com";

export const metadata: Metadata = {
  // 分享预览图（同目录的 opengraph-image.png）要用完整网址，这里是线上的正式域名
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  // 告诉搜索引擎正式地址是带 www 的这一个
  alternates: { canonical: "/" },
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
        {/* 给搜索引擎的结构化说明：这个网站叫什么、是个什么应用 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              { "@context": "https://schema.org", "@type": "WebSite", name: "Mnemoflow", url: `${SITE}/` },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Mnemoflow",
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web",
                inLanguage: "zh-CN",
                description: DESCRIPTION,
                url: `${SITE}/`,
              },
            ]),
          }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
