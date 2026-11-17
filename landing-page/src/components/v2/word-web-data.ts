/**
 * 词汇网用的词：从 quintessential 出发，一轮一轮往外"裂变"，一共五轮、八十来个词。
 * 每一行是 [单词, 从哪个词连过来]；每一对之间都有真实的关系：
 * 同根（vital → vitamin）、派生（need → needless）、近义（essential → vital）、成对（queen → king）、形近（royal → loyal）。
 */
export const TREE: [string, string | null][] = [
  ["quintessential", null],
  // 第 1 轮
  ["essential", "quintessential"], ["queen", "quintessential"], ["quintet", "quintessential"], ["typical", "quintessential"],
  // 第 2 轮
  ["essence", "essential"], ["necessary", "essential"], ["vital", "essential"], ["fundamental", "essential"],
  ["king", "queen"], ["royal", "queen"], ["crown", "queen"], ["throne", "queen"],
  ["quartet", "quintet"], ["duet", "quintet"], ["quintuple", "quintet"],
  ["type", "typical"], ["classic", "typical"],
  // 第 3 轮
  ["core", "essence"],
  ["necessity", "necessary"], ["need", "necessary"], ["unnecessary", "necessary"],
  ["vitality", "vital"], ["vitamin", "vital"], ["survive", "vital"], ["vivid", "vital"],
  ["foundation", "fundamental"], ["profound", "fundamental"],
  ["kingdom", "king"],
  ["loyal", "royal"], ["regal", "royal"], ["reign", "royal"], ["royalty", "royal"],
  ["coronation", "crown"],
  ["enthrone", "throne"], ["dethrone", "throne"],
  ["quarter", "quartet"],
  ["dual", "duet"], ["duo", "duet"], ["double", "duet"],
  ["triple", "quintuple"], ["multiple", "quintuple"],
  ["prototype", "type"], ["stereotype", "type"], ["typewriter", "type"],
  ["class", "classic"], ["classical", "classic"],
  // 第 4 轮
  ["courage", "core"], ["record", "core"], ["cordial", "core"],
  ["necessitate", "necessity"],
  ["needy", "need"], ["needless", "need"],
  ["vigor", "vitality"],
  ["survival", "survive"], ["survivor", "survive"],
  ["revive", "vivid"], ["vivacious", "vivid"],
  ["fund", "foundation"], ["founder", "foundation"], ["found", "foundation"],
  ["freedom", "kingdom"], ["wisdom", "kingdom"],
  ["loyalty", "loyal"],
  ["regulate", "regal"], ["regular", "regal"],
  ["sovereign", "reign"],
  ["corona", "coronation"],
  ["quarterly", "quarter"], ["headquarters", "quarter"],
  ["classify", "class"], ["classmate", "class"],
  // 第 5 轮
  ["encourage", "courage"], ["discourage", "courage"],
  ["recording", "record"],
  ["accord", "cordial"], ["concord", "cordial"],
  ["revival", "revive"],
  ["refund", "fund"],
  ["regulation", "regulate"], ["regulator", "regulate"],
  ["irregular", "regular"],
];

/** 更远的地方零星标几个别的词，告诉人"外面那些点也都是词" */
export const EXTRA = [
  "abandon", "abstract", "adequate", "advocate", "anticipate", "arbitrary", "candid", "coherent", "compel", "consensus",
  "crucial", "deliberate", "depict", "diminish", "elaborate", "eloquent", "emerge", "enhance", "evoke", "explicit",
  "feasible", "fragile", "generic", "hierarchy", "implicit", "inevitable", "inherent", "integrity", "intuition", "notion",
  "obscure", "paradox", "perceive", "plausible", "pragmatic", "prevail", "subtle", "tangible", "trivial", "versatile",
];
