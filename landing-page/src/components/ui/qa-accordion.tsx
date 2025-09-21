"use client";

import React from "react";
import GridBackground from "@/components/ui/grid-background";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion-1";

export default function QandAAccordion() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
      <GridBackground className="absolute inset-0 w-full h-full" startOnView />
      <div className="relative z-10 w-full mx-auto max-w-4xl px-6 sm:px-8 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">
          关于 Mnemoflow，你可能想问
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q1: 助记词会不会反而增加了我的记忆负担？</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p><strong className="font-extrabold">A:</strong> 我们可以从另一个角度来看。</p>
                <p>想象一下古代的工匠是如何建造一座坚固的石拱桥的。</p>
                <p>他们无法让石块凭空悬在空中（<strong className="font-extrabold">这就像试图让一个孤立的单词在大脑中凭空留存</strong>）。他们必须先用木头搭建一个<strong className="font-extrabold">临时的“脚手架”</strong>。</p>
                <p>这个脚手架（<strong className="font-extrabold">这正是 Mnemoflow 的助记词</strong>）本身不是桥的一部分，它的存在似乎增加了工程量。但所有的石块都会沿着这个脚手架的弧度被精准地安放。</p>
                <p>当最后一块“拱心石”被放入的瞬间，整座桥的结构力学形成闭环，它开始能够自我支撑。此时，工匠们会做什么？<strong className="font-extrabold">他们会毫不犹豫地拆除并移走所有的脚手架。</strong></p>
                <p>助记词就是那座<strong className="font-extrabold">必不可少、但注定要被拆除的“认知脚手架”</strong>。它的最终使命，就是帮助你将知识的“拱心石”安放到位，然后让自己变得不再被需要。</p>
                <p><strong className="font-extrabold">它是一个阶段性的工具，而非永久的认知负担。</strong></p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q2: 这种联想记忆，会不会不够精确？</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p><strong className="font-extrabold">A:</strong> 我们的目标是高效解决从“完全不认识”到“能识别、能理解”的核心问题。</p>
                <p>助记词配合精准读音与生动的场景故事，足以让你对单词的<strong className="font-extrabold">核心释义</strong>形成八九不离十的准确记忆。</p>
                <p>词汇的精细化辨析与拼写巩固，可在真实阅读与使用中快速补全；Mnemoflow帮你打通了最难的“初次见面”环节。</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q3: 如果 AI 生成的助记词我不喜欢或觉得不合理怎么办？</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p><strong className="font-extrabold">A:</strong> 我们理解创造力具有主观性。</p>
                <p>Mnemoflow 提供<strong className="font-extrabold">重新生成</strong>功能，你可随时获得全新记忆角度。</p>
                <p>你的每一次选择与反馈，也在持续帮助模型进化，提供更优质的连接方案。</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q4: 这和词根词缀记忆法有什么不同？</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p><strong className="font-extrabold">A:</strong> 词根词缀是一种优秀的<strong className="font-extrabold">逻辑连接</strong>方式，Mnemoflow 完全支持这种方式。</p>
                <p>但并非所有单词都有清晰词源；当逻辑路径走不通时，传统方法容易退回死记硬背。</p>
                <p>Mnemoflow 能开启<strong className="font-extrabold">创造性连接</strong>路径：谐音、联想等，为“不讲道理”的单词架桥铺路——二者是互补的思维武器。</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q5：Mnemoflow 最适合这样的你</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p><strong className="font-extrabold">A:</strong> 如果你有一定的词汇基础（大学及以上、或职场用户），并希望高效大规模扩充你的<strong className="font-extrabold">积极词汇量</strong>，Mnemoflow 将非常适合你。</p>
                <p>你更看重在阅读与交流中的快速反应与理解，而非考试中对偏僻词的精准拼写；你相信学习应当高效且有趣，并愿意拥抱 AI 的新可能。</p>
                <p className="text-sm text-slate-400">（对于备考的高中生，Mnemoflow 同样能极大提升记忆效率，但我们建议你配合课后练习，补全拼写短板。）</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}


