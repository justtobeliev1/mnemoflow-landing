import { BackgroundPaths } from "@/components/ui/background-paths";
import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page";
import MemoryPrinciplesPage from "@/components/ui/memory-principles-page";
import RevelationInteractivePage from "@/components/ui/revelation-interactive-page";
import { AboutSection } from "@/components/about-section";
import { LampDemo } from "@/components/ui/lamp";
import { MnemoflowFeatures } from "@/components/ui/features-mnemoflow";
import ToothpasteDialoguePage from "@/components/ui/toothpaste-dialogue-page";
import CyberneticBentoGrid from "@/components/ui/cybernetic-bento-grid";
import QandAAccordion from "@/components/ui/qa-accordion";

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
      
      {/* 第五页：Lamp 场景页 */}
      <section id="lamp-section">
        <LampDemo />
      </section>
      
      {/* 第六页：产品特性展示 */}
      <section id="features-section">
        <MnemoflowFeatures />
      </section>

      {/* 第七页：对话式挤牙膏页面 */}
      <section id="dialogue-section">
        <ToothpasteDialoguePage />
      </section>

      {/* 第八页：产品亮点 Bento Grid */}
      <section id="core-features-section">
        <CyberneticBentoGrid />
      </section>

      {/* 第九页：Q&A */}
      <section id="qa-section">
        <QandAAccordion />
      </section>

      {/* 第十页：关于页面 */}
      <AboutSection />
    </main>
  );
}