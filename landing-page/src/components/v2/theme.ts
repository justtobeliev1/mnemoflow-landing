/**
 * 天色：一天里的七个时刻，各对应一套配色。默认是「破晓」。
 * 访客可以在导航栏的天色盘（sky-dial.tsx）里手动切换；选择记在 localStorage。
 * 切换时把颜色写进 :root 的 CSS 变量，并广播事件让首屏的 WebGL 光带平滑过渡到新颜色。
 */

export type Sky = {
  id: string;
  /** 时刻名 */
  name: string;
  clock: string;
  note: string;
  /** 文字色：主 / 次 / 弱 */
  ink: string;
  inkSoft: string;
  inkFaint: string;
  /** 按钮悬停、焦点、时间轴高亮用的单色 */
  brand: string;
  /** 界面里的渐变（Logo、翻牌背面、高亮、光晕），四个色标 */
  flow: [string, string, string, string];
  /** 首屏光带着色器的五层颜色，可以比界面渐变更浅更柔 */
  shader: [string, string, string, string, string];
  /** 光带上的丝绸高光强度 */
  sheen: number;
};

export const SKIES: Sky[] = [
  {
    id: "dawn",
    name: "破晓",
    clock: "05:00",
    note: "雾蓝、丁香、裸粉、奶油",
    ink: "#1B2140",
    inkSoft: "#525873",
    inkFaint: "#9296AB",
    brand: "#6C7CF0",
    flow: ["#7C8CF0", "#A88BEB", "#E58FB0", "#F0B27A"],
    shader: ["#A9B8F5", "#C9B8F2", "#F3C1CF", "#F7DDB5", "#BFE3EE"],
    sheen: 0.04,
  },
  {
    id: "sunrise",
    name: "日出",
    clock: "07:00",
    note: "朱砂、橙、杏黄",
    ink: "#1D1410",
    inkSoft: "#5A4E47",
    inkFaint: "#9A8E86",
    brand: "#E5502E",
    flow: ["#E5502E", "#F2793F", "#F5A552", "#F7CE7E"],
    shader: ["#EE5A36", "#F58B54", "#F7B267", "#F9DDA4", "#F4845F"],
    sheen: 0.05,
  },
  {
    id: "grove",
    name: "晨林",
    clock: "10:00",
    note: "墨绿、翠、青柠",
    ink: "#0A2620",
    inkSoft: "#40564F",
    inkFaint: "#84968F",
    brand: "#0E9F6E",
    flow: ["#0B7A63", "#17A877", "#6CCB7F", "#CDE86B"],
    shader: ["#0B7A63", "#19A974", "#7BD389", "#D7F171", "#9BE3DE"],
    sheen: 0.05,
  },
  {
    id: "noon",
    name: "正午",
    clock: "13:00",
    note: "宝蓝、青、薄荷",
    ink: "#07183A",
    inkSoft: "#40526F",
    inkFaint: "#8493AA",
    brand: "#2B50FF",
    flow: ["#2B50FF", "#2F8BFF", "#22C1DC", "#6FE0C0"],
    shader: ["#2B50FF", "#3B82F6", "#22C1DC", "#8BE8CF", "#A9B8FF"],
    sheen: 0.06,
  },
  {
    id: "dusk",
    name: "黄昏",
    clock: "18:00",
    note: "靛、紫、玫瑰、琥珀",
    ink: "#0A1B3D",
    inkSoft: "#44536D",
    inkFaint: "#8592A8",
    brand: "#5B5BF6",
    flow: ["#5B5BF6", "#9B6BFF", "#FF6FA5", "#FFB45E"],
    shader: ["#5B5BF6", "#9B6BFF", "#FF6FA5", "#FFB45E", "#5CC8FF"],
    sheen: 0.07,
  },
  {
    id: "night",
    name: "深夜",
    clock: "22:00",
    note: "只有一种蓝紫，由深到浅",
    ink: "#0B1033",
    inkSoft: "#454B6E",
    inkFaint: "#8A8FAD",
    brand: "#3A47D5",
    flow: ["#2A2F9E", "#4C55E8", "#7C86FF", "#AEB6FF"],
    shader: ["#2A2F9E", "#3A47D5", "#6C7BFF", "#A9B4FF", "#DDE2FF"],
    sheen: 0.05,
  },
  {
    id: "moon",
    name: "月光",
    clock: "02:00",
    note: "黑白灰，只留一点电蓝",
    ink: "#0B0D12",
    inkSoft: "#4A4F5A",
    inkFaint: "#8C919C",
    brand: "#2F6BFF",
    flow: ["#14171F", "#3A404D", "#6C7482", "#A4ABB8"],
    shader: ["#1B1F2A", "#4B5362", "#8E97A6", "#C9CFD9", "#E6E9EF"],
    sheen: 0.09,
  },
];

export const SKY_EVENT = "mf-sky";
const STORE_KEY = "mf-sky-v1";

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const triplet = (hex: string) => hexToRgb(hex).join(" ");

let active = SKIES[0];

/** 着色器用：当前生效的天色 */
export function currentSky() {
  return active;
}

function write(sky: Sky) {
  active = sky;
  const s = document.documentElement.style;
  s.setProperty("--ink", triplet(sky.ink));
  s.setProperty("--ink-soft", triplet(sky.inkSoft));
  s.setProperty("--ink-faint", triplet(sky.inkFaint));
  s.setProperty("--brand", triplet(sky.brand));
  sky.flow.forEach((c, i) => s.setProperty(`--g${i + 1}`, triplet(c)));
  window.dispatchEvent(new Event(SKY_EVENT));
}

/**
 * 切换天色。animate 为 true 时整页做一次交叉淡化（浏览器支持 View Transitions 的话）。
 * 返回的 Promise 在淡化结束后完成——淡化期间整页被快照盖住，鼠标事件会乱（会收到一次假的"移开"）。
 */
export function applySky(sky: Sky, animate = false): Promise<void> {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduce && typeof doc.startViewTransition === "function") {
    return doc.startViewTransition(() => write(sky)).finished.catch(() => {});
  }
  write(sky);
  return Promise.resolve();
}

export function loadSky(): Sky {
  try {
    const id = localStorage.getItem(STORE_KEY);
    return SKIES.find((s) => s.id === id) ?? SKIES[0];
  } catch {
    return SKIES[0];
  }
}

export function saveSky(sky: Sky) {
  try {
    localStorage.setItem(STORE_KEY, sky.id);
  } catch {}
}
