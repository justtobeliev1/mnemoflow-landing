"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SKY_EVENT, currentSky, hexToRgb, type Sky } from "./theme";

/**
 * 首屏那条流动的渐变光带。原生 WebGL，一个全屏三角形 + 片元着色器：
 * 几层低频噪声把四种颜色揉在一起，沿斜向缓慢流动；左侧渐隐到白，给标题留出干净的底。
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
uniform float uSheen;

// ── 3D simplex noise（Ian McEwan / Ashima Arts，MIT）──
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime * 0.045;

  // 把坐标转一个角度，让色带沿斜向流动
  vec2 q = vec2(uv.x * aspect, uv.y);
  float a = -0.42; mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
  q = R * q + (uMouse - 0.5) * 0.06;

  vec3 indigo = uC0; vec3 violet = uC1; vec3 rose = uC2; vec3 amber = uC3; vec3 sky = uC4;

  // 逐层用噪声做遮罩叠色：频率在流向上低、垂直流向上高，所以呈带状
  vec3 col = indigo;
  float n1 = snoise(vec3(q.x * 0.55 + t * 1.2, q.y * 1.9, t * 0.9));
  col = mix(col, violet, smoothstep(-0.35, 0.65, n1));
  float n2 = snoise(vec3(q.x * 0.75 - t * 0.9, q.y * 2.4 + 3.0, t * 1.1 + 7.0));
  col = mix(col, rose, smoothstep(-0.05, 0.75, n2 + (uv.x - 0.5) * 0.5));
  float n3 = snoise(vec3(q.x * 0.6 + t * 0.7 + 5.0, q.y * 2.9 - 2.0, t * 0.8 + 13.0));
  col = mix(col, amber, smoothstep(0.15, 0.85, n3 + (uv.x - 0.55) * 0.7) * 0.92);
  float n4 = snoise(vec3(q.x * 0.9 - t * 1.1 + 9.0, q.y * 2.1 + 6.0, t * 0.7 + 21.0));
  col = mix(col, sky, smoothstep(0.35, 0.95, n4 - (uv.x - 0.35) * 0.6) * 0.75);

  // 一点高光，让色带有丝绸的起伏
  float sheen = snoise(vec3(q.x * 1.4 + t * 1.6, q.y * 5.5, t * 1.4 + 40.0));
  col += uSheen * smoothstep(0.2, 1.0, sheen);

  // 左侧渐隐到白：标题压在这里
  float fade = smoothstep(0.1, 0.74, uv.x * 0.95 + (uv.y - 0.5) * 0.2 + n1 * 0.07);
  col = mix(vec3(1.0), col, fade);

  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function Gradient({ className, active = true }: { className?: string; /** false 时停止渲染（比如被别的层盖住了） */ active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const wake = useRef<() => void>(() => {});
  useEffect(() => {
    activeRef.current = active;
    if (active) wake.current();
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return; // 没有 WebGL 时保留下面的 CSS 渐变兜底

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uColors = [0, 1, 2, 3, 4].map((i) => gl.getUniformLocation(prog, `uC${i}`));
    const uSheen = gl.getUniformLocation(prog, "uSheen");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 五层颜色各有"当前值"和"目标值"，每帧向目标靠近一点：切换天色时光带是慢慢变过去的
    const cur = new Float32Array(16);
    const goal = new Float32Array(16);
    const setGoal = (sky: Sky, snap = false) => {
      sky.shader.forEach((hex, i) => {
        const [r, g, b] = hexToRgb(hex);
        goal[i * 3] = r / 255;
        goal[i * 3 + 1] = g / 255;
        goal[i * 3 + 2] = b / 255;
      });
      goal[15] = sky.sheen;
      if (snap) cur.set(goal);
    };
    const pushColors = (k: number) => {
      for (let i = 0; i < 16; i++) cur[i] += (goal[i] - cur[i]) * k;
      for (let i = 0; i < 5; i++) gl.uniform3f(uColors[i], cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
      gl.uniform1f(uSheen, cur[15]);
    };
    setGoal(currentSky(), true);
    const onSky = () => {
      setGoal(currentSky(), reduce);
      if (!running) draw(performance.now());
    };
    window.addEventListener(SKY_EVENT, onSky);

    // 渐变本身很柔，用不着满分辨率：按 0.6 倍渲染再由 CSS 放大
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const start = performance.now() - 20000; // 从一个好看的相位开始
    let raf = 0;
    let running = false;
    const draw = (now: number) => {
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mx, my);
      pushColors(0.045);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "1";
      if (!activeRef.current) running = false;
      if (running) raf = requestAnimationFrame(draw);
    };

    // 滚出视口就停，省电
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(draw);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    let onScreen = false;
    const io2 = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io2.observe(canvas);
    wake.current = () => {
      if (onScreen && !reduce && !running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    if (reduce) draw(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      io2.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(SKY_EVENT, onSky);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("h-full w-full bg-[linear-gradient(100deg,#fff_0%,rgb(var(--g2)/0.45)_40%,rgb(var(--g3)/0.6)_72%,rgb(var(--g4)/0.7)_100%)]", className)}
    />
  );
}
