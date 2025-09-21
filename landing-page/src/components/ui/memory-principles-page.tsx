"use client";

import React from "react";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-pattern";
import {
  NoisePatternCard,
  NoisePatternCardBody,
} from "@/components/ui/card-with-noise-pattern";
import GridBackground from "@/components/ui/grid-background";

const MemoryPrinciplesPage = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 flex flex-col justify-start">
      <GridBackground className="w-full">
        <div className="relative z-10 w-full px-6 py-24 sm:px-12 md:px-16 lg:px-24">
          {/* 左上角标题 */}
          <h2 className="text-left font-extrabold tracking-tight text-slate-100 text-3xl md:text-5xl lg:text-6xl pt-24">
            大脑，为连接而生
          </h2>

          {/* 两列卡片：大屏并排，小屏纵向堆叠；卡片内容加粗、换行 */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:gap-8 lg:gap-10 md:grid-cols-2">
            {/* 卡片A */}
            <GridPatternCard className="rounded-xl border-zinc-800 bg-zinc-950">
              <GridPatternCardBody className="p-6 md:p-8 py-12">
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="shrink-0">
                    <svg
                      className="icon"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      width="44"
                      height="44"
                      aria-hidden
                    >
                      <path
                        d="M861.859 418.165c-16.48 0-31.989 4.155-45.54 11.471L689.413 314.492c9.381-17.799 14.699-38.073 14.699-59.591 0-70.692-57.308-128-128-128s-128 57.308-128 128c0 45.071 23.298 84.696 58.504 107.502l-81.771 245.745a129.121 129.121 0 0 0-8.765-0.306c-26.925 0-51.929 8.364-72.567 22.619l-94.502-82.047c4.296-10.897 6.655-22.769 6.655-35.191 0-53.019-42.981-96-96-96s-96 42.981-96 96 42.981 96 96 96c17.23 0 33.397-4.543 47.376-12.49l94.49 82.037c-8.601 17.193-13.452 36.576-13.452 57.073 0 70.579 57.42 128 128 128s128-57.421 128-128c0-44.984-23.329-84.618-58.52-107.452l81.787-245.795c2.897 0.196 5.818 0.305 8.764 0.305 25.961 0 50.112-7.736 70.287-21.019l126.91 115.148c-4.796 11.424-7.449 23.969-7.449 37.135 0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96zM416.081 799.843c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.711 64-64 64z"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-slate-100">
                      卡片 A：当大脑顺应天性
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        建立深刻的神经连接
                      </span>
                      <br />
                      记忆、回归到生物学，是神经元之间构建的突触
                    </p>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        构建坚固的思维枢纽
                      </span>
                      <br />
                      一个被有效连接的信息，会成为可以被随时、轻松调用的坚固节点
                    </p>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        释放与生俱来的天赋
                      </span>
                      <br />
                      大脑痴迷于逻辑、故事与情感，渴望探索事物之间的“为什么”
                    </p>
                  </div>
                </div>
              </GridPatternCardBody>
            </GridPatternCard>

            {/* 卡片B */}
            <NoisePatternCard className="rounded-xl border-zinc-800 bg-zinc-950">
              <NoisePatternCardBody className="p-6 md:p-8 py-12">
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="shrink-0">
                    <svg
                      className="icon"
                      viewBox="0 0 1491 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      width="44"
                      height="44"
                      aria-hidden
                    >
                      <path
                        d="M523.33696 454.314354L361.363879 612.656395c-17.545563 17.100201-17.545563 44.923163 0 62.024581s45.986678 17.101417 63.531023 0.088829l172.429356-168.531829V460.694227l-73.987298 72.126755v-78.506628zM770.285371 505.707435c24.101877 5.581628 48.291366-9.216318 53.872994-32.78522s-9.391543-47.140239-33.582249-52.721867L651.463739 388.657517c-22.773092 13.82326-68.228012 41.468565-68.228012 41.468565l101.809043 23.125974c-9.9233 6.025773-24.632417 14.975604-39.608021 24.013047l124.848622 28.443549z"
                        fill="#ffffff"
                      ></path>
                      <path
                        d="M381.919894 746.452415L249.097344 876.085637c-21.974847 21.443089-57.417638 21.35426-79.392485 0.088829l-15.594974-15.240874a54.193022 54.193022 0 0 1 0-77.708384l126.885606-123.961548c15.772632-18.520249 57.949396-72.834954 83.645328-150.898654-60.341696-11.608618-125.201505 5.227529-171.897598 50.772495L58.680714 690.098292c-74.519056 72.925-74.607885 191.037216 0 264.049828l15.682587 15.152046c74.607885 72.925 195.557763 72.925 270.16443 0l133.973678-130.962008c48.645465-47.493121 64.949855-114.037032 50.240738-174.910485-55.733537 28.177062-112.708246 55.025338-146.823469 83.024742zM1095.38631 321.580632l-184.569731-41.911493c-63.531024-14.44263-126.974435 4.076402-171.71994 43.860865 36.15099 27.999403 81.60591 59.722326 147.352793 85.85997l178.543958 40.493879c30.214046 6.91163 48.910735 36.329865 42.000322 65.835711l-5.139917 21.087774c-7.088071 29.418235-37.214505 47.760825-67.429767 41.025636l-181.556844-41.202078c-84.531185-10.632716-131.759036 1.682885-168.264125 12.936187 21.97363 55.734753 70.795536 100.214988 134.770705 114.658835l184.569732 41.999105c102.872558 23.303632 205.391017-39.075048 229.315236-139.467693l5.04987-21.087774c23.836606-100.570304-40.138562-200.785292-142.922292-224.088924zM435.527618 284.897885l-33.582248 78.683069 102.07553 37.303334zM660.145866 234.745977l-54.492364 33.049274 44.746722 64.949854zM530.159761 173.783694l-55.733537-3.632256 78.062483 167.024168z"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold text-slate-100">
                      卡片 B：当我们强迫大脑
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        记忆沦为信息孤岛
                      </span>
                      <br />
                      一个孤立的信息，难以被抵达，没有连接，终被遗忘
                    </p>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        裹上低效的认知枷锁
                      </span>
                      <br />
                      传统记词法，强迫大脑将初见时毫无关联的中文与英文连接
                    </p>
                    <p className="text-sm md:text-base leading-relaxed text-slate-300">
                      <span className="font-semibold text-slate-200">
                        陷入被迫接受的折磨
                      </span>
                      <br />
                      我们总在以违背天性的方式强迫大脑机械重复
                    </p>
                  </div>
                </div>
              </NoisePatternCardBody>
            </NoisePatternCard>
          </div>
        </div>
      </GridBackground>
    </section>
  );
};

export default MemoryPrinciplesPage;
