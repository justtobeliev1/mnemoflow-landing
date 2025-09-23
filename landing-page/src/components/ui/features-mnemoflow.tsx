// features-mnemoflow.tsx

import { BrainCircuit, Cpu, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import GridBackground from '@/components/ui/grid-background'

export function MnemoflowFeatures() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800 py-16 md:py-32 text-slate-100">
            <GridBackground className="absolute inset-0 w-full h-full" startOnView />
            <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                {/* 1. 文本内容已被替换 */}
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl">这，就是 Mnemoflow 为你构建的记忆连接</h2>
                    <p className="mt-6 text-lg text-gray-300">
                        告别死记硬背<br />Mnemoflow 为每个单词创造一个情节新奇、逻辑自洽且能引发情感共鸣的记忆场景<br />帮助你快速构建单词中英文间的连接
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
                                    className="absolute inset-0 z-10 h-full w-full object-cover 
                                                [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_60%,transparent_100%)]"
                                    alt="Mnemoflow Mnemonic Showcase" 
                                    width={2797} 
                                    height={1137}
                                    priority
                                /> 
  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}