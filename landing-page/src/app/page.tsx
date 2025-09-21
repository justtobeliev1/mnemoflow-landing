import { BackgroundPaths } from "@/components/ui/background-paths";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <BackgroundPaths title="Mnemoflow" />
      <AboutSection />
    </main>
  );
}