/**
 * 案例展示用的助记候选。
 *
 * 来源要分清：
 *   · source: "product" —— 产品里的真实内容（截图、产品文档、提示词范例）；
 *   · source: "draft"   —— 按同样的思路手写的；还没有在产品里生成过。
 *
 * segs 是单词的拆法：t 是字母，note 是它对应的联想；
 * scene 里用 { h } 标出要高亮的片段，和产品里记忆场景的高亮一致。
 */

export type Part = string | { h: string };

export type Mnemonic = {
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
  /** 这条主要靠什么：拆分 / 谐音 / 词根 */
  how: "拆分" | "谐音" | "词根";
  segs: { t: string; note: string; sub?: string }[];
  /** 助记蓝图：一句话点破 */
  blueprint: Part[];
  /** 记忆场景 */
  scene: Part[];
  source: "product" | "draft";
};

export const MNEMONICS: Mnemonic[] = [
  /* ───────── 产品里的真实内容 ───────── */
  {
    word: "quintessential",
    ipa: "/ˌkwɪntɪˈsenʃl/",
    pos: "adj.",
    meaning: "精髓的；典范的",
    how: "谐音",
    segs: [
      { t: "quint", note: "Queen’s", sub: "女王的" },
      { t: "essential", note: "essential", sub: "必要的" },
    ],
    blueprint: [{ h: "女王的" }, { h: "必要" }, "品质"],
    scene: [
      "年轻的王室成员问老女王：成为女王的精髓是什么？女王从容地为她倒了一杯茶，微笑着说：「优雅、沉着与仁慈，这些都是",
      { h: "女王的 (Queen’s)" },
      { h: "必要 (essential)" },
      "的品质。」",
    ],
    source: "product",
  },
  {
    word: "disparate",
    ipa: "/ˈdɪspərət/",
    pos: "adj.",
    meaning: "迥然不同的",
    how: "谐音",
    segs: [
      { t: "dis", note: "不" },
      { t: "pa", note: "爸" },
      { t: "rate", note: "水准" },
    ],
    blueprint: [{ h: "不" }, "是和", { h: "爸" }, "爸一个", { h: "水准" }, "的人"],
    scene: [
      "银行家父亲看着在车库里扫吉他的儿子，摇摇头：「我这儿子，完全",
      { h: "不 (dis)" },
      "是和",
      { h: "爸爸 (pa)" },
      "在同一个",
      { h: "水准 (rate)" },
      "上的人啊。」",
    ],
    source: "product",
  },
  {
    word: "equivalent",
    ipa: "/ɪˈkwɪvələnt/",
    pos: "adj.",
    meaning: "相等的；等价的",
    how: "词根",
    segs: [
      { t: "equi", note: "equal", sub: "相等" },
      { t: "val", note: "value", sub: "价值" },
      { t: "ent", note: "lent", sub: "借出" },
    ],
    blueprint: [{ h: "借出" }, "的东西，", { h: "价值" }, { h: "相等" }],
    scene: [
      "朋友想",
      { h: "借用 (lent)" },
      "你新买的相机，摘下自己的手表作抵押：「这块表的",
      { h: "价值 (value)" },
      "和你的相机是",
      { h: "相等 (equal)" },
      "的，这样总公平了吧？」",
    ],
    source: "product",
  },

  /* ───────── 手写的候选 ───────── */
  {
    word: "scrutiny",
    ipa: "/ˈskruːtəni/",
    pos: "n.",
    meaning: "仔细审查",
    how: "拆分",
    segs: [
      { t: "scru", note: "screw", sub: "螺丝" },
      { t: "tiny", note: "tiny", sub: "极小的" },
    ],
    blueprint: ["连一颗", { h: "极小的" }, { h: "螺丝" }, "都不放过"],
    scene: [
      "质检员趴在发动机上，举着放大镜，连最",
      { h: "小 (tiny)" },
      "的一颗",
      { h: "螺丝 (screw)" },
      "都要拧一拧、看一看。这台机器，正在接受最仔细的审查。",
    ],
    source: "draft",
  },
  {
    word: "mortgage",
    ipa: "/ˈmɔːɡɪdʒ/",
    pos: "n.",
    meaning: "按揭；抵押贷款",
    how: "词根",
    segs: [
      { t: "mort", note: "死", sub: "mortal" },
      { t: "gage", note: "抵押" },
    ],
    blueprint: ["一份", { h: "押" }, "到", { h: "死" }, "的约定"],
    scene: [
      "签完三十年的房贷合同，他合上笔帽，苦笑了一下：「这哪是贷款，这是一份",
      { h: "押 (gage)" },
      "到",
      { h: "死 (mort)" },
      "的约定。」",
    ],
    source: "draft",
  },
  {
    word: "ponder",
    ipa: "/ˈpɒndə(r)/",
    pos: "v.",
    meaning: "沉思；仔细考虑",
    how: "拆分",
    segs: [
      { t: "pond", note: "池塘" },
      { t: "er", note: "人" },
    ],
    blueprint: ["坐在", { h: "池塘" }, "边发呆的", { h: "人" }],
    scene: [
      "傍晚，",
      { h: "池塘 (pond)" },
      "边坐着一个",
      { h: "人 (er)" },
      "。他盯着水面一动不动，鱼咬钩了也没察觉。他在想一件很重要的事。",
    ],
    source: "draft",
  },
  {
    word: "candid",
    ipa: "/ˈkændɪd/",
    pos: "adj.",
    meaning: "坦率的",
    how: "拆分",
    segs: [
      { t: "can", note: "能" },
      { t: "did", note: "做了" },
    ],
    blueprint: ["敢说「是我", { h: "做的" }, "，我也", { h: "能" }, "改」"],
    scene: [
      "线上出了故障，会议室里没人说话。她举起手：「是我",
      { h: "做的 (did)" },
      "，今晚我",
      { h: "能 (can)" },
      "修好。」全场松了一口气。",
    ],
    source: "draft",
  },
  {
    word: "bargain",
    ipa: "/ˈbɑːɡən/",
    pos: "v. / n.",
    meaning: "讨价还价；便宜货",
    how: "拆分",
    segs: [
      { t: "bar", note: "酒吧" },
      { t: "gain", note: "赚到" },
    ],
    blueprint: ["在", { h: "酒吧" }, "磨到半价，", { h: "赚到" }, "了"],
    scene: [
      { h: "酒吧 (bar)" },
      "快打烊了，他指着最后一瓶酒，跟老板磨了十分钟。最后半价拿下，出门时满脸都写着：",
      { h: "赚到 (gain)" },
      "了。",
    ],
    source: "draft",
  },
  {
    word: "ephemeral",
    ipa: "/ɪˈfemərəl/",
    pos: "adj.",
    meaning: "短暂的；转瞬即逝的",
    how: "谐音",
    segs: [
      { t: "e", note: "一" },
      { t: "phe", note: "飞" },
      { t: "meral", note: "没了" },
    ],
    blueprint: [{ h: "一飞" }, "就", { h: "没了" }],
    scene: [
      "黄昏的河面上，一只蜉蝣刚刚长出翅膀。它",
      { h: "一 (e)" },
      { h: "飞 (phe)" },
      "起来，天还没黑透，就",
      { h: "没了 (meral)" },
      "。它的一生，只有这一个傍晚。",
    ],
    source: "draft",
  },
  {
    word: "meticulous",
    ipa: "/məˈtɪkjələs/",
    pos: "adj.",
    meaning: "一丝不苟的",
    how: "拆分",
    segs: [
      { t: "me", note: "我" },
      { t: "tic", note: "tick", sub: "打勾" },
      { t: "ulous", note: "……的" },
    ],
    blueprint: [{ h: "我" }, "一项一项", { h: "打勾" }],
    scene: [
      "出发前夜，行李箱摊在地上。",
      { h: "我 (me)" },
      "拿着清单一项一项",
      { h: "打勾 (tick)" },
      "：护照，打勾；充电器，打勾；连指甲刀都没落下。",
    ],
    source: "draft",
  },
  {
    word: "resilient",
    ipa: "/rɪˈzɪliənt/",
    pos: "adj.",
    meaning: "有韧性的；能恢复的",
    how: "拆分",
    segs: [
      { t: "re", note: "再" },
      { t: "silient", note: "silent", sub: "一声不吭" },
    ],
    blueprint: [{ h: "一声不吭" }, "地", { h: "再" }, "站起来"],
    scene: [
      "第三次被摔在垫子上，全场都以为他要认输了。他没喊疼，",
      { h: "一声不吭 (silent)" },
      "地撑着地，",
      { h: "再 (re)" },
      "一次站了起来。",
    ],
    source: "draft",
  },
];
