"use client";

import { Guides } from "./hero";
import { Lines, Rise } from "./ui";
import { WordRail } from "./word-rail";

/**
 * 「换一个词，换一种拆法」
 * 第一幕只演示了一个词；这里挂出十张词牌，让访客自己挑着看，说明这不是碰巧。
 * 词和助记的出处见 mnemonics.ts（两条是产品里的真实内容，八条是按同样思路写的）。
 */
export function Examples() {
  return (
    <section id="more" className="relative overflow-hidden bg-mist py-28 lg:py-36">
      <Guides />
      <div className="wrap relative">
        <div className="grid items-end gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <h2 className="head text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.1]">
            <Lines lines={["换一个词，", "换一种拆法"]} />
          </h2>
          <Rise delay={0.15}>
            <p className="max-w-[26em] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.75] text-navy-soft lg:pb-3">
              有的词靠谐音，有的词靠词根。哪种好记用哪种，AI 来挑。
            </p>
          </Rise>
        </div>

        <Rise delay={0.1} className="mt-14 lg:mt-20">
          <WordRail />
        </Rise>
      </div>
    </section>
  );
}
