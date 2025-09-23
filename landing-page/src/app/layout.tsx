import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mnemoflow - 革新词汇学习体验",
  description: "基于认知科学理论的智能化英语词汇学习应用，告别死记硬背，将枯燥的词汇学习转变为高效而充满乐趣的流动体验。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}