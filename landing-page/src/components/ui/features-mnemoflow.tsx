// features-mnemoflow.tsx

import { BrainCircuit, Cpu, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export function MnemoflowFeatures() {
    return (
        <section className="overflow-hidden bg-black py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                {/* 1. 文本内容已被替换 */}
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl">AI 赋能的深度记忆引擎</h2>
                    <p className="mt-6 text-lg text-gray-300">
                        我们不满足于传统的“一词一图”。Mnemoflow 的核心是为每个单词创造一个情节新奇、逻辑自洽且能引发情感共鸣的个性化记忆场景。
                    </p>
                </div>

                {/* 2. 图片结构已被简化为单张图片 */}
                <div className="relative -mx-4 rounded-3xl p-3 md:-mx-12 lg:col-span-3">
                    <div className="[perspective:800px]">
                        <div className="[transform:skewY(-2deg)skewX(-2deg)rotateX(6deg)]">
                            <div className="aspect-[88/36] relative rounded-2xl overflow-hidden border border-white/10">
                                <div className="[background-image:radial-gradient(var(--tw-gradient-stops,at_75%_25%))] to-black z-1 -inset-[4.25rem] absolute from-transparent to-75%"></div>
                                
                                {/* 关键：这里是你需要替换为自己图片的地方 */}
                                <Image 
                                  src="/showcase-mnemonic-page.png" 
                                  className="absolute inset-0 z-10 h-full w-full object-cover"
                                  alt="Mnemoflow Mnemonic Showcase" 
                                  width={2797} 
                                  height={1137}
                                  priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 四个特性点已被替换 */}
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-purple-400" />
                            <h3 className="text-sm font-medium">AI 深度助记</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">AI 扮演你的专属记忆编织师，创造独特的记忆场景。</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="size-4 text-blue-400" />
                            <h3 className="text-sm font-medium">启发式反馈</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">在你遗忘时提供线索，鼓励主动回忆而非被动接收。</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-teal-400" />
                            <h3 className="text-sm font-medium">心流式体验</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">极简设计，无缝交互，让你完全沉浸于学习本身。</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-gray-400" />
                            <h3 className="text-sm font-medium">科学记忆算法</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">基于 FSRS 算法，为你规划最高效的个性化复习路径。</p>
                    </div>
                </div>
            </div>
        </section>
    )
}