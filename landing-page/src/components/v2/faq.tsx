"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Guides } from "./hero";
import { Lines, Rise } from "./ui";

// 回答按意思分段：一段说一件事
const QA: { q: string; a: string[] }[] = [
  {
    q: "多记一段联想，不是更累吗？",
    a: [
      "第一次见一个词，确实要多读两句话。但死背的累在后面：背了忘，忘了再背，同一个词来回好几遍。",
      "联想是把力气花在前面，让你第一次就看懂它为什么是这个意思。",
      "它就像脚手架，房子盖好就拆了。等你一眼能认出这个词，自然就不会再去想那个故事。",
    ],
  },
  {
    q: "靠联想记，意思会不会不准？",
    a: [
      "词义不归联想管。每张单词卡的上半部分是词典给的音标、发音和释义，下半部分才是 AI 写的联想，两块是分开的。",
      "联想只负责一件事：帮你把这个词和它的意思连起来。",
      "至于更细的用法、搭配和拼写，还是要靠多读多用，这一点哪种方法都绕不过去。",
    ],
  },
  {
    q: "AI 写的联想我不喜欢，怎么办？",
    a: [
      "让它重写一条，它会换个全新的角度。",
      "也可以直接提要求，比如“搞笑一点”或者“换成科幻背景”，它会照你的意思再写。",
      "每条联想下面还能标一下有没有帮助。好不好记是很个人的事，你说了算。",
    ],
  },
  {
    q: "这和词根词缀法有什么不同？",
    a: [
      "词根词缀是它会用的方法之一。能用词根讲通的词，它就老老实实用词根。",
      "比如 equivalent 里的 equi 是“相等”，val 是“价值”，价值相等，就是“等价的”。",
      "但很多词的词根讲不通，或者词根本身比单词还难记。这时候它会换成谐音、拆分，或者编个小故事。哪种好记用哪种。",
    ],
  },
  {
    q: "适合谁用？",
    a: [
      "已经有一些基础、想把词汇量再往上提一截的人。比如在准备四六级、考研，或者想少查几次词典把英文原文读下来。",
      "它主要解决的是“看到这个词能认出来”，不负责练拼写。如果你需要默写单词，建议搭配拼写练习一起用。",
    ],
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative overflow-hidden bg-white py-28 lg:py-40">
      <Guides />
      <div className="wrap relative grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
        <div>
          <h2 className="head text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.1] lg:sticky lg:top-32">
            <Lines lines={["你可能", "想问"]} />
          </h2>
        </div>

        <Rise delay={0.1}>
          <ul>
            {QA.map((item, i) => {
              const on = open === i;
              return (
                <li key={item.q} className="border-t border-navy/[0.12]">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => setOpen(on ? null : i)}
                      className="group flex w-full items-center gap-6 py-7 text-left"
                    >
                      <span className="head flex-1 text-[clamp(1.25rem,2vw,1.7rem)] leading-[1.35] ![letter-spacing:-0.01em]">{item.q}</span>
                      {/* 一个光秃秃的加号：展开时竖线转平，成了减号 */}
                      <span aria-hidden className="relative h-4 w-4 shrink-0 text-navy/55 transition-colors duration-300 group-hover:text-navy">
                        <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current" />
                        <span
                          className={cn(
                            "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            on ? "rotate-0" : "rotate-90",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  {/* 用 grid 的 0fr → 1fr 做展开：高度过渡是连续的，不会在开头结尾顿一下 */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          "max-w-[33em] space-y-[0.85em] pb-10 pr-4 sm:pr-10 text-[15px] font-[360] leading-[1.85] tracking-[0.01em] text-navy-soft [text-wrap:pretty] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:text-[15.5px]",
                          on ? "translate-y-0 opacity-100 delay-75" : "-translate-y-2 opacity-0",
                        )}
                      >
                        {item.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            <li aria-hidden className="border-t border-navy/[0.12]" />
          </ul>
        </Rise>
      </div>
    </section>
  );
}
