"use client";

import React from "react";
import GridBackground from "@/components/ui/grid-background";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion-1";

export default function QandAAccordion() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
      <GridBackground className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 w-full mx-auto max-w-4xl px-6 sm:px-8 md:px-12 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">
          关于 Mnemoflow，你可能想问
        </h2>

        <Accordion type="multiple" className="w-full" defaultValue={["q1"]}>
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
              <p className="text-slate-300 leading-relaxed">
                <strong className="font-extrabold">A:</strong> 我们的目标是高效解决从“完全不认识”到“能识别、能理解”的核心问题。助记词，配合精准的读音和生动的场景故事，足以让你对单词的<strong className="font-extrabold">核心释义</strong>形成八九不离十的准确记忆。词汇的精细化辨析和拼写巩固，可以在你实际阅读和使用中得到快速补全。我们帮你打通了最难的“初次见面”环节。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q3: 如果 AI 生成的助记词我不喜欢或觉得不合理怎么办？</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-300 leading-relaxed">
                <strong className="font-extrabold">A:</strong> 我们完全理解创造力是主观的。因此，Mnemoflow 提供了“重新生成”功能，你可以随时让 AI 给你提供新的记忆角度。你的每一次选择和反馈，也会帮助我们的模型不断进化，为你提供更优质的连接方案。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q4: 这和词根词缀记忆法有什么不同？</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-slate-300 leading-relaxed">
                <strong className="font-extrabold">A:</strong> 词根词缀是一种优秀的<strong className="font-extrabold">“逻辑连接”</strong>方式，Mnemoflow 完全支持并尊重它。但并非所有单词都有清晰的词根来源。当逻辑路径走不通时，传统方法只能退回死记硬背。而 Mnemoflow 则能开启<strong className="font-extrabold">“创造性连接”</strong>的路径，通过谐音、联想等方式，为那些“不讲道理”的单词架设桥梁。它们是两种强大的、互为补充的思维武器。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Q5：Mnemoflow 最适合这样的你</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-slate-300 leading-relaxed space-y-3">
                <p><strong className="font-extrabold">A:</strong> 如果你有一定的词汇基础（如大学及以上水平的学习者、职场人士），渴望高效、大规模地扩充你的积极词汇量，那么 Mnemoflow 将是你的利器。</p>
                <p>你更看重在阅读和交流中对单词的快速反应和理解，而非在考试中对偏僻单词的精准拼写。你相信学习应该是聪明和有趣的，并愿意拥抱 AI 带来的全新可能性。</p>
                <p className="text-sm text-slate-400">（对于备考的高中生，Mnemoflow 同样能极大提升记忆效率，但我们建议你配合课后练习，补全拼写短板。）</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}


