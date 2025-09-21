import { BackgroundPaths } from "@/components/ui/background-paths";
import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page";
import MemoryPrinciplesPage from "@/components/ui/memory-principles-page";
import RevelationInteractivePage from "@/components/ui/revelation-interactive-page";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 第一页：英雄页 - 让用户记住产品名称 */}
      <BackgroundPaths title="Mnemoflow" />
      
      {/* 第二页：第一性原理页 */}
      <section id="first-principles-section">
        <DigitalSerenity />
      </section>
      
      {/* 第三页：记忆原理页 */}
      <MemoryPrinciplesPage />

      {/* 第四页：交互启示页 */}
      <RevelationInteractivePage />
      
      {/* 第五页：关于页面 */}
      <AboutSection />
    </main>
  );
}