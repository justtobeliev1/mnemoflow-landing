"use client";

import React, { useEffect, useRef } from "react";
import GridBackground from "@/components/ui/grid-background";
import { GradientButton } from "@/components/ui/gradient-button";
import { BookmarkIconButton } from "@/components/ui/bookmark-icon-button";

// Reusable BentoItem component
const BentoItem = ({ className = "", children }: { className?: string; children: React.ReactNode }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    };

    item.addEventListener("mousemove", handleMouseMove);
    return () => item.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={itemRef}
      className={`bento-item ${className}`}
    >
      {children}
    </div>
  );
};

// Main Component
export const CyberneticBentoGrid = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
      <GridBackground className="absolute inset-0 w-full h-full" startOnView />
      <div className="relative z-10 w-full mx-auto max-w-6xl px-6 sm:px-8 md:px-12 py-16 md:py-24 min-h-screen flex flex-col">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-8">
          Mnemoflow，不止于Mnemonic
        </h1>

        <div className="flex-1 flex items-center">
          <div className="bento-grid">
          <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                助记词——与你共同成长的伙伴
              </h2>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Mnemoflow 的 AI 引擎是一个<strong className="font-extrabold">持续学习</strong>与<strong className="font-extrabold">自我进化</strong>的伙伴<br />你可根据偏好随时再生成场景；每一次交互，都会让助记词更“戳你”
              </p>
              <p className="mt-3 text-slate-400 leading-relaxed">
                下面是你将会在应用中遇见的组件，希望你会喜欢 🥰
              </p>
            </div>
            <div className="relative mt-4 h-56 md:h-60 bg-neutral-800/40 rounded-lg border border-white/10 p-4 overflow-hidden">
              {/* 背景光晕 */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 80%)",
                  opacity: 0.15,
                  transform: "none",
                } as React.CSSProperties}
              />

              {/* 内容布局：左列按钮（竖排），右列图标区 */}
              <div className="relative z-10 h-full grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3 justify-center">
                  <GradientButton
                    variant="variant"
                    className="w-full whitespace-nowrap text-[15px] px-7 py-3 brightness-[0.9] hover:brightness-100"
                    style={{
                      ['--border-color-1' as any]: 'transparent',
                      ['--border-color-2' as any]: 'transparent',
                      ['--color-2' as any]: '#18324f',
                      ['--color-3' as any]: '#3b787b',
                    } as React.CSSProperties}
                  >
                    ✅ 心中有数，直接对答案
                  </GradientButton>
                  <GradientButton
                    className="w-full whitespace-nowrap text-[15px] px-7 py-3 brightness-[0.9] hover:brightness-100"
                    style={{
                      ['--color-1' as any]: '#100b0e',
                      ['--color-2' as any]: '#2a2036',
                      ['--color-3' as any]: '#6a4b58',
                      ['--color-4' as any]: '#d78b94',
                      ['--border-color-1' as any]: 'transparent',
                      ['--border-color-2' as any]: 'transparent',
                    } as React.CSSProperties}
                  >
                    🤔 有点模糊，进入测试
                  </GradientButton>
                </div>
                <div className="flex items-center justify-center gap-5">
                  <div className="box-content w-12 h-12 grid place-items-center rounded-lg ring-1 ring-white/15 text-slate-300/80">
                    <svg className="w-6 h-6 icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M782.121161 734.870588H391.760314c-27.724298 0-50.196078-22.479812-50.196079-50.196078s22.47178-50.196078 50.196079-50.196079h340.164768v-124.249349c0-13.312 5.288659-26.077867 14.701428-35.494651l91.232376-91.236392-91.232376-91.232376a50.200094 50.200094 0 0 1-14.701428-35.494651V132.517647H157.549427v501.960784h83.393757c27.720282 0 50.196078 22.479812 50.196079 50.196079S268.663467 734.870588 240.943184 734.870588H107.353349c-27.720282 0-50.196078-22.479812-50.196078-50.196078v-602.352941C57.157271 54.597271 79.633067 32.12549 107.353349 32.12549h674.767812c27.720282 0 50.196078 22.47178 50.196078 50.196079v153.656219l112.021585 112.0256c19.608596 19.60458 19.608596 51.384722 0 70.989302l-112.021585 112.0256V684.67451c0 27.716267-22.47178 50.196078-50.196078 50.196078z" fill="currentColor"></path>
                    <path d="M327.541459 499.752157c-4.565835 0-9.203953-0.626447-13.813961-1.939577-26.656125-7.613741-42.088408-35.398275-34.474667-62.0544l42.269114-147.949929c7.613741-26.656125 35.386227-42.100455 62.0544-34.474667 26.656125 7.613741 42.088408 35.398275 34.474667 62.0544l-42.269114 147.945914c-6.300612 22.046118-26.399122 36.418259-48.240439 36.418259zM509.777318 499.752157c-4.565835 0-9.203953-0.626447-13.813961-1.939577-26.656125-7.617757-42.088408-35.398275-34.474667-62.0544l42.269114-147.949929c7.617757-26.65211 35.40229-42.092424 62.0544-34.474667 26.660141 7.613741 42.092424 35.398275 34.478682 62.0544l-42.265098 147.945914c-6.308643 22.046118-26.411169 36.418259-48.24847 36.418259z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="box-content w-12 h-12 grid place-items-center rounded-lg ring-1 ring-white/15 text-slate-400/80">
                    <svg className="w-6 h-6" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M959.533 151.507c0-0.926-0.452-2.29-0.92-3.201 0-0.459-0.437-0.919-0.437-1.37-0.467-1.371-0.919-2.75-1.838-3.661 0 0 0-0.46-0.452-0.46l-2.741-4.112s0-0.451-0.452-0.451l-3.208-3.201c-0.452-0.46-0.919-0.46-0.919-0.904-1.356-0.919-2.741-1.837-4.099-2.298h-0.452l-4.127-1.362c-0.452 0-0.904-0.46-1.37-0.46-0.919-0.459-2.29-0.459-3.646-0.459h-6.402c-1.37 0-2.741 0.459-4.112 0.919-0.466 0-0.919 0.459-1.371 0.459-0.466 0-0.918 0.444-1.37 0.444L79.983 516.119C70.388 520.691 64 529.819 64 540.786c0 10.517 5.921 20.097 15.064 25.129l253.138 126.114 22.385 178.634c1.371 10.98 9.129 20.108 19.659 22.865 2.289 0.905 5.016 0.905 7.306 0.905 8.21 0 15.983-3.662 21.467-10.501l89.557-112.394 81.797 40.659c-10.98-22.399-18.287-46.609-21.028-71.736l-55.285-27.883-91.847-45.691L872.266 247.91 788.66 485.501h58.015l111.939-320.285c0-0.461 0.468-0.927 0.468-1.379 0-0.459 0.452-0.912 0.452-1.371 0-1.83 0.467-2.733 0.467-4.112v-5.483c-0.001-0.46-0.001-0.913-0.468-1.364zM442.32 746.397l-42.044 52.543-9.596-78.123 51.64 25.58z m-89.555-105.539l-197.839-98.701 625.961-286.481-428.122 385.182z m0 0" fill="currentColor"></path>
                    <path d="M933.487 584.187c14.627 0 26.513-11.871 26.513-26.496 0-14.613-11.886-26.5-26.513-26.5H830.224c-15.066 0-26.485 10.967-26.485 26.5v103.264c0 14.625 11.872 26.497 26.485 26.497 14.625 0 26.512-11.872 26.512-26.497v-50.721c31.529 24.223 50.72 62.154 50.72 102.346 0 70.815-57.574 128.857-128.842 128.857-71.284 0-128.874-57.576-128.874-128.857 0-60.771 43.415-113.751 102.812-126.089 12.354-2.304 21.029-13.254 21.029-26.058 0-7.76-3.646-15.534-9.596-20.563-5.95-5.033-14.159-6.854-21.934-5.47-84.057 16.903-145.293 91.846-145.293 177.727 0 100.072 81.331 181.402 181.387 181.402 100.07 0 181.389-81.33 181.389-181.402 0-48.884-19.645-95.039-53.901-128.844h27.855v0.904z m0 0" fill="currentColor"></path>
                    </svg>
                  </div>
                  {/* 收藏按钮，统一为内容尺寸，不含边框 */}
                  <div className="box-content w-12 h-12 grid place-items-center rounded-lg ring-1 ring-white/15">
                    <BookmarkIconButton />
                  </div>
                </div>
              </div>
            </div>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl md:text-2xl font-bold text-white">守护您的心流时刻</h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">记忆不应被频繁打断<br />内置的 “AI 问答小栈” 让你无需离开应用即可解决所有关于词汇的疑问<br />从学习到解惑，我们守护每一个心流时刻</p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl md:text-2xl font-bold text-white">好的记忆，源于一次漂亮的主动“回想”</h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">Mnemoflow 的启发式反馈系统，在你遗忘时，不会粗暴地给出答案。它会先提供核心线索，鼓励并训练你主动回忆的能力</p>
          </BentoItem>

          <BentoItem className="row-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">记忆的艺术，当交给科学的“调度”</h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed"><br />“记住”是一种主观感觉，但记忆的巩固需要科学的调度 <br />优秀的助记词也应该搭配高效的复习策略<br />基于产品特性，我们摒弃了传统的艾宾浩斯曲线，采用更个性化的复习策略<br />先进的 FSRS 间隔重复算法将为你规划最高效、最个性化的复习路径<br />复习，当因人而异<br />千人千面的大脑，怎能用同一套艾宾浩斯公式框住？</p>
          </BentoItem>

          <BentoItem className="col-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">从“灵感”到“内化”，构建无缝的记忆闭环</h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed"><br /><br />从单词的收录、学习、测试，到复习和解惑<br />Mnemoflow 构筑了一个完整的深度记忆闭环，让学习不再碎片化</p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl md:text-2xl font-bold text-white">用词汇，探索未至之境</h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">我们相信，语言学习的终点，不是记住一本厚厚的词典，而是获得睁眼看世界的能力<br />愿 Mnemoflow 成为你语言学习之旅的起点！</p>
          </BentoItem>
          </div>
        </div>
      </div>

      {/* styles scoped to this component */}
      <style>{`
        .main-container{position:relative}
        .bento-grid{
          display:grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }
        @media (min-width: 768px){
          .bento-grid{gap:1.25rem}
        }
        .bento-item{
          position:relative;
          border-radius: 0.75rem;
          background: rgba(9,9,11,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1rem;
          overflow: hidden;
        }
        .bento-item::before{
          content:"";
          position:absolute; inset: -1px;
          background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.12), transparent 40%);
          pointer-events:none;
          transition: opacity .2s ease;
          opacity: 0;
        }
        .bento-item:hover::before{ opacity: 1; }
      `}</style>
    </section>
  );
};

export default CyberneticBentoGrid;


