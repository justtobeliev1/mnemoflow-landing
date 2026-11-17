# Mnemoflow 图标

图标「扇」：九张词卡绕着同一个点旋开，越往前越大、越不透明。

- `icons/fan-grad-dawn.*`：最终版（破晓配色）。网页导航栏里用的是同一套形状，颜色跟着天色走
- `icons/favicon.svg`：浏览器标签页图标（最早的紫色版，深色界面下自动换成白色），对应 `landing-page/src/app/icon.svg`
- `icons/home-icon.svg`：手机主屏图标的源文件，对应 `landing-page/src/app/apple-icon.png`
- `icons/fan-grad-*`：另外四个渐变配色（靛蓝、晚霞、潮汐、墨蓝）
- `icons/fan-black.*`、`icons/fan-white.*`：黑白版
- `icons/fan-color.*`、`icons/fan-color-white.*`：最早的紫色版和它的白色版
- `icons/fan-mark*.svg`、`icons/fan-dark*.svg`、`icons/fan-light*.svg`：线条版
- `icons/index.html`：所有版本的对比页，直接用浏览器打开

SVG 和对比页由 `make-fan.py` 生成：`python3 make-fan.py icons`
