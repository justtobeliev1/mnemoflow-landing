import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-pattern"
import { NoisePatternCard, NoisePatternCardBody } from "@/components/ui/card-with-noise-pattern"

export function PatternCardsDemo() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Pattern Cards Demo</h2>
      
      {/* Grid Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GridPatternCard width="w-full" height="h-48">
          <GridPatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-foreground">
              方形网格图案
            </h3>
            <p className="text-sm text-foreground/60">
              一个干净有序的图案，以方形网格为特色。
              简约的设计创造了微妙的纹理，增加了深度而不压倒内容。
            </p>
          </GridPatternCardBody>
        </GridPatternCard>

        <GridPatternCard width="w-full" height="h-64" className="border-blue-200 dark:border-blue-800">
          <GridPatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-foreground">
              可调节尺寸
            </h3>
            <p className="text-sm text-foreground/60">
              这个卡片展示了如何通过 width 和 height 属性来调节卡片的大小。
              支持 Tailwind CSS 的所有尺寸类。
            </p>
          </GridPatternCardBody>
        </GridPatternCard>

        <GridPatternCard 
          width="w-full" 
          height="h-40"
          patternClassName="bg-[length:25px_25px]"
          gradientClassName="from-blue-50 via-blue-50/85 to-blue-50 dark:from-blue-950 dark:via-blue-950/85 dark:to-blue-950"
        >
          <GridPatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-foreground">
              自定义样式
            </h3>
            <p className="text-sm text-foreground/60">
              可以通过 patternClassName 和 gradientClassName 来自定义图案和渐变效果。
            </p>
          </GridPatternCardBody>
        </GridPatternCard>
      </div>

      {/* Noise Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NoisePatternCard width="w-full" height="h-48">
          <NoisePatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-white">
              噪点纹理图案
            </h3>
            <p className="text-sm text-white/60">
              使用 SVG 滤镜创建的复杂噪点图案。
              有机纹理增加了深度和视觉趣味，同时保持现代、高端的感觉。
            </p>
          </NoisePatternCardBody>
        </NoisePatternCard>

        <NoisePatternCard width="w-full" height="h-64" className="border-zinc-700">
          <NoisePatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-white">
              深色主题
            </h3>
            <p className="text-sm text-white/60">
              噪点图案卡片专为深色主题设计，提供优雅的视觉层次。
              适合展示重要信息或统计数据。
            </p>
          </NoisePatternCardBody>
        </NoisePatternCard>

        <NoisePatternCard 
          width="w-full" 
          height="h-40"
          patternClassName="bg-[length:300px_300px]"
          overlayClassName="bg-zinc-950/50"
        >
          <NoisePatternCardBody>
            <h3 className="text-lg font-bold mb-2 text-white">
              自定义覆盖层
            </h3>
            <p className="text-sm text-white/60">
              可以通过 overlayClassName 调整覆盖层的透明度和颜色。
            </p>
          </NoisePatternCardBody>
        </NoisePatternCard>
      </div>

      {/* 使用示例 */}
      <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <h3 className="text-lg font-bold mb-4">使用示例</h3>
        <div className="space-y-4 text-sm">
          <div>
            <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
              &lt;GridPatternCard width="w-64" height="h-32"&gt;
            </code>
          </div>
          <div>
            <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
              &lt;NoisePatternCard width="w-full" height="h-48"&gt;
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
