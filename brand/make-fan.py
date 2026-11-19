# 用法：python3 make-fan.py <输出目录>   —— 「扇」的线条版：一摞词卡绕着同一个点旋开，一张比一张大
# 生成：大图标（细节版）、小尺寸用的简化版、不带底的纯图形，以及一张预览页
import sys, os, math
out = sys.argv[1]
INK = "#1B2140"

def squircle(n=5.0, r=256, c=256, steps=180):
    pts = []
    for i in range(steps):
        t = 2 * math.pi * i / steps
        ct, st = math.cos(t), math.sin(t)
        pts.append(f"{c + r * (abs(ct) ** (2 / n)) * (1 if ct >= 0 else -1):.1f} {c + r * (abs(st) ** (2 / n)) * (1 if st >= 0 else -1):.1f}")
    return "M" + "L".join(pts) + "Z"
SQ = squircle()

def rdp(pts, tol):
    """把折线上多余的点去掉（直线段只留两头）"""
    if len(pts) < 3: return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0
    n = math.hypot(dx, dy) or 1
    best, at = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs((pts[i][0] - x0) * dy - (pts[i][1] - y0) * dx) / n
        if d > best: best, at = d, i
    if best <= tol: return [pts[0], pts[-1]]
    return rdp(pts[:at + 1], tol)[:-1] + rdp(pts[at:], tol)

def fan(K, a0, a1, s0, R, L, rc, sw0, sw1, gap, word, dot, centre=(256, 256)):
    """K 张卡绕同一个点旋开，角度从 a0 到 a1（度，0 朝上，顺时针为正），大小从 s0 倍长到 1 倍，线也从 sw0 粗到 sw1。
    每张卡的下端是以那个点为圆心的半圆，所以后面的卡的下端全藏在前面的卡里，露出来的只有一条条边和卡顶，像螺壳。
    被前面的卡挡住的部分是算出来再裁掉的：每一段线都在离前面那张卡 gap 远的地方收住，端头是圆的，线和线不粘在一起。"""
    T = [k / (K - 1) for k in range(K)]
    angs = [math.radians(a0 + (a1 - a0) * t) for t in T]
    sc = [s0 + (1 - s0) * t for t in T]
    sws = [sw0 + (sw1 - sw0) * t for t in T]
    rot = lambda x, y, a: (x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a))

    def outline(k, step=1.0):
        """卡 k 的两条边和卡顶（不含下端的半圆），在以旋转点为原点的坐标里"""
        r, l, c = R * sc[k], L * sc[k], rc * sc[k]
        pts = []
        n = max(2, int((l - c) / step))
        pts += [(-r, -(l - c) * i / n) for i in range(n + 1)]
        n = max(3, int(c * 1.57 / step))
        pts += [(-r + c - c * math.cos(1.5708 * i / n), -(l - c) - c * math.sin(1.5708 * i / n)) for i in range(1, n + 1)]
        n = max(2, int((2 * r - 2 * c) / step))
        pts += [(-r + c + (2 * r - 2 * c) * i / n, -l) for i in range(1, n + 1)]
        n = max(3, int(c * 1.57 / step))
        pts += [(r - c + c * math.sin(1.5708 * i / n), -l + c - c * math.cos(1.5708 * i / n)) for i in range(1, n + 1)]
        n = max(2, int((l - c) / step))
        pts += [(r, -(l - c) + (l - c) * i / n) for i in range(1, n + 1)]
        return [rot(x, y, angs[k]) for x, y in pts]

    def sd(k, x, y):
        """点到卡 k 的带符号距离（里面为负）。卡是上面两个小圆角、下面一个半圆的圆角矩形"""
        r, l, c = R * sc[k], L * sc[k], rc * sc[k]
        x, y = rot(x, y, -angs[k])
        cy, hy = (-l + r) / 2, (l + r) / 2
        rad = c if y < cy else r
        qx, qy = abs(x) - r + rad, abs(y - cy) - hy + rad
        return min(max(qx, qy), 0) + math.hypot(max(qx, 0), max(qy, 0)) - rad

    xs, ys = [-R, R], [-R, R]
    for k in range(K):
        for x, y in outline(k, 8): xs.append(x); ys.append(y)
    bx0, bx1, by0, by1 = min(xs) - sw1 / 2, max(xs) + sw1 / 2, min(ys) - sw1 / 2, max(ys) + sw1 / 2
    px, py = centre[0] - (bx0 + bx1) / 2, centre[1] - (by0 + by1) / 2
    path = lambda pts: "M" + "L".join(f"{x + px:.1f} {y + py:.1f}" for x, y in rdp(pts, 0.12))

    strokes = []  # (线宽, path)
    for k in range(K - 1):
        pts, run = outline(k), []
        vis = [all(sd(j, x, y) > sws[j] / 2 + gap + sws[k] / 2 for j in range(k + 1, K)) for x, y in pts]
        for p_, v in zip(pts + [None], vis + [False]):
            if v: run.append(p_)
            else:
                if len(run) > sws[k] * 0.9: strokes.append((sws[k], path(run)))  # 太短的碎屑不要
                run = []
    # 最前面那张：完整的一圈
    r, l, c = R, L, rc
    bottom = [rot(r * math.cos(math.pi * i / 40), r * math.sin(math.pi * i / 40), angs[-1]) for i in range(1, 40)]
    front = path(outline(K - 1) + bottom) + "Z"
    strokes.append((sw1, front))
    if word:  # 最前面那张卡上的一行"字"
        a_, b_ = rot(-R * 0.3, -(L - rc - R * 0.55), angs[-1]), rot(-R * 0.3, -(L * 0.56), angs[-1])
        strokes.append((sw1, path([a_, b_])))
    g = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + "".join(f'<path d="{d}" stroke-width="{w:.1f}"/>' for w, d in strokes) + "</g>"
    if dot:   # 卡下端的孔
        g += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{dot}" fill="currentColor"/>'
    return g, (bx0 + px, by0 + py, bx1 + px, by1 + py), strokes, (px, py)

# 细节版：九张卡，给 64px 以上用
BIG = dict(K=9, a0=-132, a1=62, s0=0.44, R=54, L=250, rc=26, sw0=7, sw1=13, gap=8, word=True, dot=9)
# 简化版：五张卡、线更粗，给 16–32px 用
SMALL = dict(K=4, a0=-40, a1=56, s0=0.58, R=58, L=250, rc=30, sw0=22, sw1=26, gap=9, word=False, dot=0)

def tile(kind, spec, uid, corner=True):
    g, *_ = fan(**spec)
    if kind == "dark":
        bg = f'<radialGradient id="{uid}bg" cx=".5" cy=".36" r=".8"><stop offset="0" stop-color="#2A3160"/><stop offset="1" stop-color="#171C3A"/></radialGradient>'
        fill, col = f'url(#{uid}bg)', "#fff"
    else:
        bg = f'<linearGradient id="{uid}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EEF0F8"/></linearGradient>'
        fill, col = f'url(#{uid}bg)', INK
    shape = f'<path d="{SQ}" fill="{fill}"/>' if corner else f'<rect width="512" height="512" fill="{fill}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>{bg}</defs>{shape}<g color="{col}">{g}</g></svg>\n'

def mark(spec, color=INK):
    g, (x0, y0, x1, y1), *_ = fan(**spec)
    pad = 4
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - pad:.1f} {y0 - pad:.1f} {x1 - x0 + pad * 2:.1f} {y1 - y0 + pad * 2:.1f}"><g color="{color}">{g}</g></svg>\n'

def mix(c0, c1, t):
    a, b = [int(c0[i:i + 2], 16) for i in (1, 3, 5)], [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(a, b))
def ramp(stops, t):
    """在一串颜色里按 t（0–1）取色"""
    u = t * (len(stops) - 1)
    i = min(int(u), len(stops) - 2)
    return mix(stops[i], stops[i + 1], u - i)

def color_fan(kind, stops=None, parts=False, shadows=True):
    """最早那版「扇」，去掉外面的底：九张卡旋开，越往前越大、越不透明。kind="color" 用渐变色（放浅色底上），"white" 用白色（放深色底上）"""
    K, PX, PY = 9, 0.0, 0.0
    cards, xs, ys = [], [], []
    for k in range(K):
        t = k / (K - 1)
        ang, sc = -128 + t * 196, 0.5 + 0.5 * t
        w, h = 112 * sc, 252 * sc
        cards.append((ang, w, h, 32 * sc, t))
        a = math.radians(ang)
        for x, y in [(-w / 2, -4), (w / 2, -4), (-w / 2, -h - 4), (w / 2, -h - 4)]:
            xs.append(x * math.cos(a) - y * math.sin(a)); ys.append(x * math.sin(a) + y * math.cos(a))
    x0, x1, y0, y1 = min(xs) - 6, max(xs) + 6, min(ys) - 6, max(ys) + 6
    rect = lambda c, extra="": f'<rect x="{-c[1] / 2:.1f}" y="{-c[2] - 4:.1f}" width="{c[1]:.1f}" height="{c[2]:.1f}" rx="{c[3]:.1f}" transform="rotate({c[0]:.1f})" {extra}/>'
    if kind == "color":
        grad = f'<linearGradient id="cf" x1="{x0:.0f}" y1="{y0:.0f}" x2="{x1:.0f}" y2="{y1:.0f}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4C5AE0"/><stop offset=".5" stop-color="#7C5CE0"/><stop offset="1" stop-color="#C768B4"/></linearGradient>'
        shade, dot = "#1B1464", "#fff"
    elif kind == "black":  # 黑白：纯黑的卡，只靠不透明度分出前后
        grad = '<linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1c1c"/><stop offset="1" stop-color="#000"/></linearGradient>'
        shade, dot = "#000", "#fff"
    elif kind == "mono-white":  # 黑白的反相：纯白的卡，放黑底上
        grad = '<linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ececec"/></linearGradient>'
        shade, dot = "#000", "#000"
    else:
        grad = '<linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9E2FF"/></linearGradient>'
        shade, dot = "#1B1464", "#7C5CE0"
    if stops: shade, dot = mix(stops[-1], "#000000", 0.55), "#fff"
    defs = grad + f'<filter id="cs" x="{x0 - 40:.0f}" y="{y0 - 40:.0f}" width="{x1 - x0 + 80:.0f}" height="{y1 - y0 + 80:.0f}" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="9"/></filter>'
    body = ""
    for k, c in enumerate(cards):
        t = c[4]
        if k and shadows:  # 这张卡落在后面几张上的影子：只画在后面的卡上，不溢到图标外面
            defs += f'<clipPath id="cc{k}">{"".join(rect(cards[j]) for j in range(k))}</clipPath>'
            body += f'<g clip-path="url(#cc{k})"><g transform="translate(-10 6)" filter="url(#cs)">{rect(c, f"""fill="{shade}" opacity="{0.24 * t:.2f}" """)}</g></g>'
        fill, lo = "url(#cf)", 0.16
        if stops:  # 渐变配色：每张卡一个颜色，从后往前沿着色带走；卡自己从卡顶到卡底略微加深
            col = ramp(stops, t)
            defs += f'<linearGradient id="cf{k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{mix(col, "#FFFFFF", 0.2)}"/><stop offset="1" stop-color="{mix(col, "#000000", 0.06)}"/></linearGradient>'
            fill, lo = f"url(#cf{k})", 0.3
        body += rect(c, f'fill="{fill}" fill-opacity="{lo + (1 - lo) * t ** 1.5:.2f}" stroke="#fff" stroke-opacity="{0.35 + 0.5 * t:.2f}" stroke-width="2"')
    body += f'<circle r="10" fill="{dot}"/>'
    if parts: return defs, body, (x0, y0, x1, y1)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}"><defs>{defs}</defs>{body}</svg>\n'

# 渐变配色（从最后面那张到最前面那张）
PALETTES = [
    ("dawn", "破晓", "页面现在的四个色标：后面是暖的橙和粉，往前变成紫，最前面一张落在蓝紫上", ["#F0B27A", "#E58FB0", "#A88BEB", "#6C7CF0"]),
    ("indigo", "靛蓝", "只用一个色相，从浅蓝紫走到深靛蓝。最稳，最像一个工具类产品的标志", ["#C7D2FE", "#818CF8", "#4F46E5", "#3730A3"]),
    ("dusk", "晚霞", "从杏黄经过玫红走到紫。最暖、最抢眼，和页面的“黄昏”天色是一套", ["#FDBA74", "#FB7185", "#D946EF", "#7C3AED"]),
    ("tide", "潮汐", "从薄荷绿经过天蓝走到靛蓝。清爽，和学习、专注这类感觉最搭", ["#6EE7B7", "#38BDF8", "#3B82F6", "#4338CA"]),
    ("ink", "墨蓝", "从灰蓝走到页面文字用的那个深蓝。几乎是单色，最克制", ["#C3C9E6", "#7E88C2", "#3F4A8C", "#1B2140"]),
]

def favicon(stops):
    """标签页图标：破晓配色的扇，不带底。浅色和深色的浏览器界面都用这一张，不切换"""
    defs, body, (x0, y0, x1, y1) = color_fan("color", stops, parts=True, shadows=False)
    side = max(x1 - x0, y1 - y0) + 8
    vx, vy = (x0 + x1 - side) / 2, (y0 + y1 - side) / 2
    defs = defs.split("<filter")[0] + defs.split("</filter>")[1]  # 没有影子，模糊滤镜也不用带
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {side:.1f} {side:.1f}"><defs>{defs}</defs>{body}</svg>\n'

def home_icon(stops):
    """主屏图标（iOS 会自己切圆角，所以底是方的、不透明）：浅色底上放破晓配色的扇"""
    defs, body, (x0, y0, x1, y1) = color_fan("color", stops, parts=True)
    w = 330; h = w * (y1 - y0) / (x1 - x0)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EEF0F8"/></linearGradient></defs>'
            f'<rect width="512" height="512" fill="url(#hb)"/><svg x="{(512 - w) / 2:.1f}" y="{(512 - h) / 2 + 4:.1f}" width="{w}" height="{h:.1f}" viewBox="{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}"><defs>{defs}</defs>{body}</svg></svg>\n')

files = {
    "fan-dark.svg": tile("dark", BIG, "a"), "fan-light.svg": tile("light", BIG, "b"),
    "fan-dark-small.svg": tile("dark", SMALL, "c"), "fan-light-small.svg": tile("light", SMALL, "d"),
    "fan-dark-square.svg": tile("dark", BIG, "e", corner=False),
    "fan-color.svg": color_fan("color"), "fan-color-white.svg": color_fan("white"),
    "fan-black.svg": color_fan("black"), "fan-white.svg": color_fan("mono-white"),
    **{f"fan-grad-{pid}.svg": color_fan("color", stops) for pid, _, _, stops in PALETTES},
    "favicon.svg": favicon(PALETTES[0][3]), "home-icon.svg": home_icon(PALETTES[0][3]),
    "fan-mark.svg": mark(BIG), "fan-mark-small.svg": mark(SMALL), "fan-mark-small-white.svg": mark(SMALL, "#fff"),
}
for f in os.listdir(out):
    if f.endswith(".svg"): os.remove(os.path.join(out, f))
for name, svg in files.items():
    open(os.path.join(out, name), "w").write(svg)

grad_cards = "".join(f'''
    <div class="opt">
      <span class="pad" style="background:#fff;box-shadow:inset 0 0 0 1px rgba(27,33,64,.08)"><img src="fan-grad-{pid}.svg" height="150" alt=""></span>
      <div>
        <h3>{name}</h3>
        <p class="note" style="margin:4px 0 12px">{why}</p>
        <div class="row" style="gap:16px"><img src="fan-grad-{pid}.svg" height="48" alt=""><img src="fan-grad-{pid}.svg" height="24" alt=""><span class="nav light"><img src="fan-grad-{pid}.svg" height="26" alt="">Mnemoflow</span><span class="nav dark"><img src="fan-grad-{pid}.svg" height="26" alt="">Mnemoflow</span></div>
      </div>
    </div>''' for pid, name, why, _ in PALETTES)
html = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Mnemoflow 图标 · 扇</title>
<style>
  body{margin:0;padding:56px 24px 80px;background:#F6F8FB;color:#1B2140;font:16px/1.6 -apple-system,"PingFang SC","MiSans",sans-serif}
  main{max-width:980px;margin:0 auto}
  h1{font-size:34px;letter-spacing:-.02em;margin:0 0 6px} .lead{color:#5b6285;margin:0 0 28px;max-width:40em}
  section{background:#fff;border-radius:28px;padding:32px;margin-bottom:20px;box-shadow:0 1px 0 rgba(27,33,64,.06),0 18px 40px -28px rgba(27,33,64,.35)}
  h2{font-size:20px;margin:0 0 18px;letter-spacing:-.01em} .note{color:#5b6285;margin:14px 0 0;font-size:14px}
  .row{display:flex;align-items:center;gap:28px;flex-wrap:wrap}
  .sh{filter:drop-shadow(0 16px 24px rgba(27,33,64,.24))} .s{filter:drop-shadow(0 3px 6px rgba(27,33,64,.2))}
  .nav{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:19px;letter-spacing:-.02em;padding:12px 18px;border-radius:14px}
  .nav.light{background:#F6F8FB} .nav.dark{background:#0B0E17;color:#fff}
  .tab{display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:8px 14px 8px 10px;border-radius:10px 10px 0 0;background:#fff;box-shadow:0 0 0 1px rgba(27,33,64,.1)}
  .tab.dark{background:#2b2d31;color:#e8e8ea;box-shadow:none}
  .pad{display:inline-flex;padding:26px 30px;border-radius:24px}
  .opt{display:flex;gap:28px;align-items:center;padding:14px 0;border-top:1px solid rgba(27,33,64,.07)} .opt:first-of-type{border-top:0;padding-top:0}
  h3{font-size:18px;margin:0}
</style>
<main>
  <h1>扇</h1>
  <p class="lead">一摞词卡绕着同一个点旋开，一张比一张大。上面是彩色版，下面是线条版</p>
  <section>
    <h2>渐变配色 · 五个选项</h2>GRADCARDS
  </section>
  <section>
    <h2>黑白版 · 不带底</h2>
    <div class="row">
      <span class="pad" style="background:#fff;box-shadow:inset 0 0 0 1px rgba(27,33,64,.08)"><img src="fan-black.svg" height="190" alt=""></span>
      <span class="pad" style="background:#000"><img src="fan-white.svg" height="190" alt=""></span>
    </div>
    <div class="row" style="margin-top:22px">
      <img src="fan-black.svg" height="64" alt=""><img src="fan-black.svg" height="32" alt=""><img src="fan-black.svg" height="16" alt="">
      <span class="nav light"><img src="fan-black.svg" height="26" alt="">Mnemoflow</span>
      <span class="nav dark"><img src="fan-white.svg" height="26" alt="">Mnemoflow</span>
    </div>
    <p class="note">纯黑和纯白两张，背景透明。九张卡只靠不透明度分出前后，最前面一张是实的</p>
  </section>
  <section>
    <h2>彩色版 · 不带底</h2>
    <div class="row">
      <span class="pad" style="background:#fff;box-shadow:inset 0 0 0 1px rgba(27,33,64,.08)"><img src="fan-color.svg" height="190" alt=""></span>
      <span class="pad" style="background:#F6F8FB"><img src="fan-color.svg" height="190" alt=""></span>
      <span class="pad" style="background:#0B0E17"><img src="fan-color-white.svg" height="190" alt=""></span>
    </div>
    <div class="row" style="margin-top:22px">
      <img src="fan-color.svg" height="64" alt=""><img src="fan-color.svg" height="32" alt=""><img src="fan-color.svg" height="16" alt="">
      <span class="nav light"><img src="fan-color.svg" height="26" alt="">Mnemoflow</span>
      <span class="nav dark"><img src="fan-color-white.svg" height="26" alt="">Mnemoflow</span>
    </div>
    <p class="note">最早那一版，去掉了外面的圆角框：九张卡旋开，越往前越大、越不透明。浅色底上用渐变色，深色底上用白色</p>
  </section>
  <section>
    <h2>线条版 · 应用图标</h2>
    <div class="row"><img class="sh" src="fan-dark.svg" width="220" height="220" alt=""><img class="sh" src="fan-light.svg" width="220" height="220" alt=""><img src="fan-mark.svg" height="190" alt=""></div>
    <p class="note">深色底、白底、不带底的纯图形。大尺寸用的是九张卡的版本，线从后往前一点点变粗，最前面那张卡上有一行“字”和一个孔</p>
  </section>
  <section>
    <h2>小尺寸</h2>
    <div class="row">
      <img class="s" src="fan-dark.svg" width="64" height="64" alt=""><img class="s" src="fan-dark-small.svg" width="32" height="32" alt=""><img class="s" src="fan-dark-small.svg" width="16" height="16" alt="">
      <img class="s" src="fan-light.svg" width="64" height="64" alt=""><img class="s" src="fan-light-small.svg" width="32" height="32" alt=""><img class="s" src="fan-light-small.svg" width="16" height="16" alt="">
      <span class="tab"><img src="fan-dark-small.svg" width="16" height="16" alt="">Mnemoflow · 这一页看完…</span>
      <span class="tab dark"><img src="fan-dark-small.svg" width="16" height="16" alt="">Mnemoflow · 这一页看完…</span>
    </div>
    <p class="note">32 像素以下换成四张卡的简化版，线更粗，不然会糊。最右边是它在浏览器标签页上的样子</p>
  </section>
  <section>
    <h2>导航栏</h2>
    <div class="row">
      <span class="nav light"><img src="fan-mark-small.svg" height="26" alt="">Mnemoflow</span>
      <span class="nav dark"><img src="fan-mark-small-white.svg" height="26" alt="">Mnemoflow</span>
      <span class="nav light"><img src="fan-dark-small.svg" width="28" height="28" alt="">Mnemoflow</span>
    </div>
    <p class="note">前两个是不带底的纯线条，跟着文字颜色走；第三个是带深色底的小方块</p>
  </section>
</main></html>'''
open(os.path.join(out, "index.html"), "w").write(html.replace("GRADCARDS", grad_cards))
print("ok", len(files))
g, (x0, y0, x1, y1), strokes, pivot = fan(**SMALL)
print("pivot", f"{pivot[0]:.1f} {pivot[1]:.1f}")
print("SMALL viewBox", f"{x0 - 4:.1f} {y0 - 4:.1f} {x1 - x0 + 8:.1f} {y1 - y0 + 8:.1f}")
for w, d in strokes: print(f"{w:.1f}", d)
_, _, (x0, y0, x1, y1) = color_fan("color", parts=True)
print("COLOR viewBox", f"{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}")
