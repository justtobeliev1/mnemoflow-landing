import { Nav } from "@/components/v2/nav";
import { ActOne } from "@/components/v2/act-one";
import { Examples } from "@/components/v2/examples";
import { Faq } from "@/components/v2/faq";
import { ActTwo } from "@/components/v2/act-two";
import { ActThree } from "@/components/v2/act-three";
import { ActFour } from "@/components/v2/act-four";
import { ActFive } from "@/components/v2/act-five";
import { ActSix } from "@/components/v2/act-six";
import { Finale } from "@/components/v2/finale";
import { SiteFooter } from "@/components/v2/site-footer";
import { SmoothScroll } from "@/components/v2/smooth-scroll";
import { Spotlight } from "@/components/v2/spotlight";

/**
 * 整页跟着一个单词（quintessential）走完它的一生，滚动条就是时间轴：
 * 词海里挑出它 → 初见（拆开、看懂）→ 遗忘 → 唤回 → 排期 → 追问 → 长进词汇网
 * → 这条路走完之后，才是别的词（词牌挂杆）→ 常见问题 → 最后再考一次 → 贴纸页尾。
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Spotlight />
      <Nav />
      <main>
        <ActOne />
        <ActTwo />
        <ActThree />
        <ActFour />
        <ActFive />
        <ActSix />
        <Examples />
        <Faq />
        <Finale />
      </main>
      <SiteFooter />
    </>
  );
}
