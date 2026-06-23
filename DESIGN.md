# DESIGN.md · 周游个人网站

> 设计规范 v1.0 | 生成于 M0 | 后续所有代码严格据此实现

---

## 1. Visual Theme & Atmosphere

### 设计哲学

**墨砚 —— 深夜墨水渗入纸面，鸦羽暗藏一缕绿调。**

一个独立开发者的私人角落。不喧哗，不讨好，不赶潮流。两套暗色主题像两种性格——墨蓝是深夜独处时的理性，鸦青是走进山林时的沉静。

### 氛围关键词

内敛 · 安静 · 精致 · 知识分子气 · 暗而不重 · 留白胜过填充

### 一句话定调

> 一个写代码也写字的人，用最少的颜色说最清楚的话。

### 情绪板映射

- **墨蓝 Ink** → 深夜书房台灯下的一页笔记、墨水在宣纸上缓慢洇开
- **鸦青 Crow** → 清晨雾气中的松林冠层、雨后苔藓覆满的岩石

---

## 2. Color Palette & Roles

### 主题一 · 墨蓝 Ink Blue

```css
:root[data-theme="ink"] {
  /* ===== 背景体系 ===== */
  --color-bg:              #0A0D14;      /* 页面底色 */
  --color-bg-rgb:          10, 13, 20;
  --color-surface:         #131722;      /* 卡片、区块 */
  --color-surface-rgb:     19, 23, 34;
  --color-hover:           #181D28;      /* hover 态 */
  --color-hover-rgb:       24, 29, 40;

  /* ===== 文字体系 ===== */
  --color-text:            #E3E6EC;      /* 主文字 */
  --color-text-rgb:        227, 230, 236;
  --color-text-dim:        #8890A0;      /* 次要文字 */
  --color-text-dim-rgb:    136, 144, 160;
  --color-text-faint:      #505660;      /* 辅助/禁用 */
  --color-text-faint-rgb:  80, 86, 96;

  /* ===== 强调体系 ===== */
  --color-accent:          #7B8CA8;      /* 链接、按钮、高亮 */
  --color-accent-rgb:      123, 140, 168;
  --color-accent-dim:      #556070;      /* 次级强调 */
  --color-accent-dim-rgb:  85, 96, 112;

  /* ===== 结构 ===== */
  --color-border:          #1E2330;      /* 边框、分割线 */
  --color-border-rgb:      30, 35, 48;

  /* ===== 背景图层 ===== */
  --color-overlay:         rgba(10, 13, 20, 0.72);  /* 图片覆盖层 */
}
```

### 主题二 · 鸦青 Crow

```css
:root[data-theme="crow"] {
  --color-bg:              #0B0F0E;
  --color-bg-rgb:          11, 15, 14;
  --color-surface:         #161B19;
  --color-surface-rgb:     22, 27, 25;
  --color-hover:           #1C221F;
  --color-hover-rgb:       28, 34, 31;

  --color-text:            #E3E8E5;
  --color-text-rgb:        227, 232, 229;
  --color-text-dim:        #88908C;
  --color-text-dim-rgb:    136, 144, 140;
  --color-text-faint:      #535B57;
  --color-text-faint-rgb:  83, 91, 87;

  --color-accent:          #8A9E8D;
  --color-accent-rgb:      138, 158, 141;
  --color-accent-dim:      #5D6E60;
  --color-accent-dim-rgb:  93, 110, 96;

  --color-border:          #1F2623;
  --color-border-rgb:      31, 38, 35;

  --color-overlay:         rgba(11, 15, 14, 0.70);
}
```

### 默认主题

首次访问默认墨蓝（Ink Blue）。用户切换后持久化到 `localStorage`。

---

## 3. Typography Rules

### 字体引入

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..500&family=JetBrains+Mono:wght@400&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
```

### 字体族 (Font Stack)

```css
:root {
  --font-heading:  'Playfair Display', 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
  --font-body:     'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
  --font-mono:     'JetBrains Mono', 'SF Mono', 'Consolas', 'Courier New', monospace;
}
```

### 字号层级

| 层级 | 标签 | 字号 (桌面) | 字重 | 行高 | 字距 |
|------|------|-----------|------|------|------|
| H1 Hero 标题 | `.hero-name` | `clamp(3.5rem, 7vw, 5.5rem)` | 600 | 1.08 | -0.02em |
| H2 区块标题 | `h2` | `clamp(1.8rem, 3.5vw, 2.4rem)` | 500 | 1.15 | -0.02em |
| H3 卡片标题 | `h3` | `1.35rem` | 500 | 1.2 | -0.01em |
| Body L | 导语/引言 | `clamp(1.05rem, 2vw, 1.25rem)` | 350 | 1.7 | 0 |
| Body M | 正文 | `1rem` | 400 | 1.75 | 0 |
| Body S | 说明文字 | `0.875rem` | 400 | 1.6 | 0 |
| Caption | 标签/日期/元信息 | `0.75rem` | 400 | 1.5 | 0.03em |
| Mono | 代码/技术标签 | `0.75rem` | 400 | 1.5 | 0 |

### 禁止字体

❌ Arial、Roboto、system-ui（作为正文字体时）、Space Grotesk、Outfit（太潮流，与本项目气质冲突）

---

## 4. Component Stylings

### 4.1 按钮 (Button)

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 450;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn:hover {
  background: var(--color-hover);
  border-color: var(--color-accent-dim);
  transform: scale(1.02);
}
.btn:active {
  transform: scale(0.98);
}
.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}
```

### 4.2 文字链接 (Link)

```css
.text-link {
  color: var(--color-text-dim);
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}
.text-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}
.text-link:hover {
  color: var(--color-text);
}
.text-link:hover::after {
  transform: scaleX(1);
}
.text-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 1px;
}
```

### 4.3 导航链接 (NavLink)

```css
.nav-link {
  font-size: 0.875rem;
  color: var(--color-text-dim);
  text-decoration: none;
  position: relative;
  padding: 4px 0;
  transition: color 0.3s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 1px;
  background: var(--color-accent);
  transform: translateX(-50%) scaleX(0);
  transition: transform 0.3s ease;
}
.nav-link:hover { color: var(--color-text); }
.nav-link:hover::after { transform: translateX(-50%) scaleX(1); }
.nav-link.active { color: var(--color-text); }
.nav-link.active::after { transform: translateX(-50%) scaleX(1); }
.nav-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```

### 4.4 标签 (Badge)

```css
.badge {
  display: inline-block;
  padding: 3px 10px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-accent-dim);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  transition: all 0.3s ease;
}
.badge:hover {
  color: var(--color-accent);
  border-color: var(--color-accent-dim);
}
```

### 4.5 卡片 (Card)

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(var(--color-accent-rgb), 0.06),
    transparent
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.card:hover {
  background: var(--color-hover);
  transform: translateY(-2px);
}
.card:hover::before {
  opacity: 1;
}
.card:focus-within {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

### 4.6 背景图层系统 (Background Layer System)

每页区块的背景不是纯色，而是 **全幅 WebP 图片 + 半透明主题色覆盖层 + CSS 噪点纹理** 的三明治结构。图片从对应主题的图库池中随机选取，每次页面加载都可能看到不同的背景。

#### 4.6.1 五层结构（从底到顶）

```
① 纯色后备                    ← var(--color-bg)，图片加载前展示
② 背景图片（全幅 WebP）        ← 1920px 宽，≤ 190KB/张
③ 半透明覆盖层                  ← var(--color-overlay)，保证文字 ≥ 4.5:1 对比度
④ 微妙噪点纹理（CSS inline SVG）← opacity 0.035，胶片质感
⑤ 文字内容                    ← 最高层
```

#### 4.6.2 图库注册表

图片存于 `public/images/backgrounds/ink/` 和 `public/images/backgrounds/crow/`，按区块分文件：

```
public/images/backgrounds/
├── ink/                         墨蓝主题
│   ├── hero-01.webp ~ hero-04.webp     Hero 区 4 张
│   ├── works-01.webp ~ works-02.webp   作品区 2 张
│   ├── blog-01.webp ~ blog-02.webp     博客区 2 张
│   └── about-01.webp ~ about-03.webp   关于区 3 张
└── crow/                        鸦青主题
    ├── hero-01.webp ~ hero-04.webp
    ├── works-01.webp ~ works-03.webp
    ├── blog-01.webp ~ blog-02.webp
    └── about-01.webp ~ about-03.webp
```

共 24 张，总计约 4.5MB。由 GitHub Pages 同域托管，无 CORS 问题。

#### 4.6.3 CSS 实现

```css
/* 背景图层容器 — 每个 section 放一个 <div class="bg-layer" data-bg-section="hero"> */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(var(--color-overlay), var(--color-overlay)),
    var(--bg-image);                          /* 由 JS 动态设置 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;               /* 背景固定 → 免费视差感 */
  transition: background-image 0.6s ease-in-out; /* 主题切换渐变 */
  will-change: background-image;
}

/* 噪点纹理 — 纯 CSS，零网络开销 */
.bg-layer::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* 移动端降级 */
@media (max-width: 768px) {
  .bg-layer {
    background-attachment: scroll;            /* iOS Safari fix */
    background-image:
      linear-gradient(var(--color-overlay), var(--color-overlay)),
      linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
    /* 移动端不加载背景图，省带宽 */
  }
}
```

#### 4.6.4 JavaScript 轮播逻辑

```js
// 图库注册表 — 与 public/images/backgrounds/ 下的真实文件一一对应
const BG_POOLS = {
  ink: {
    hero:  ['/images/backgrounds/ink/hero-01.webp', '/images/backgrounds/ink/hero-02.webp', '/images/backgrounds/ink/hero-03.webp', '/images/backgrounds/ink/hero-04.webp'],
    works: ['/images/backgrounds/ink/works-01.webp', '/images/backgrounds/ink/works-02.webp'],
    blog:  ['/images/backgrounds/ink/blog-01.webp', '/images/backgrounds/ink/blog-02.webp'],
    about: ['/images/backgrounds/ink/about-01.webp', '/images/backgrounds/ink/about-02.webp', '/images/backgrounds/ink/about-03.webp'],
  },
  crow: {
    hero:  ['/images/backgrounds/crow/hero-01.webp', '/images/backgrounds/crow/hero-02.webp', '/images/backgrounds/crow/hero-03.webp', '/images/backgrounds/crow/hero-04.webp'],
    works: ['/images/backgrounds/crow/works-01.webp', '/images/backgrounds/crow/works-02.webp', '/images/backgrounds/crow/works-03.webp'],
    blog:  ['/images/backgrounds/crow/blog-01.webp', '/images/backgrounds/crow/blog-02.webp'],
    about: ['/images/backgrounds/crow/about-01.webp', '/images/backgrounds/crow/about-02.webp', '/images/backgrounds/crow/about-03.webp'],
  }
};

/**
 * 从池中随机选图，同会话内避免与前一张重复
 */
function pickBg(pool, theme, section) {
  const key = `bg-${theme}-${section}`;
  const last = sessionStorage.getItem(key);

  if (pool.length > 1 && last) {
    const rest = pool.filter(p => p !== last);
    const picked = rest[Math.floor(Math.random() * rest.length)];
    sessionStorage.setItem(key, picked);
    return picked;
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  sessionStorage.setItem(key, picked);
  return picked;
}

/**
 * 为当前主题的所有 .bg-layer 元素随机选图
 */
function applyBackgrounds(theme) {
  document.querySelectorAll('.bg-layer[data-bg-section]').forEach(el => {
    const section = el.dataset.bgSection;
    const pool = BG_POOLS[theme]?.[section];
    if (pool) {
      el.style.setProperty('--bg-image', `url(${pickBg(pool, theme, section)})`);
    }
  });
}

// 初始化
const currentTheme = document.documentElement.dataset.theme || 'ink';
applyBackgrounds(currentTheme);

// 主题切换时重新摇号
document.addEventListener('theme-changed', (e) => {
  applyBackgrounds(e.detail.theme);
});
```

#### 4.6.5 预加载

```html
<!-- 预加载首屏 Hero 背景图（当前主题的第一张） -->
<link rel="preload" as="image" href="/images/backgrounds/ink/hero-01.webp" fetchpriority="high">
```

---

## 5. Layout Principles

### 网格

- 单列主内容区：`max-width: 960px`（比常见的 1024-1200px 更窄，强化留白感）
- 双列布局（作品卡片）：`grid-template-columns: 1fr 1fr`，`gap: 4px`
- 文章列表：日期栏 100px + 内容区自适应

### 间距梯度

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-xs` | 8px | 紧密元素间 |
| `--space-sm` | 16px | 段落间距 |
| `--space-md` | 24px | 区块内间距 |
| `--space-lg` | 48px | 组件间 |
| `--space-xl` | 80px | 区块 padding |
| `--space-2xl` | 120px | 大区块上下间距 |
| `--space-3xl` | 160px | Hero 高度余量 |

### 容器

```css
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 40px;
}
@media (max-width: 768px) {
  .container { padding: 0 24px; }
}
```

### 构图规则

- Hero 区域文字左对齐，不居中
- 作品网格左大右小交替
- 文章列表日期在左，标题在右
- 关于页照片左、文字右，不对称分配
- **禁止**居中大标题 + 居中副标题的标准 Hero 模式

---

## 6. Depth & Elevation

本项目暗色底，不使用传统投影。深度通过**颜色层级**表达：

| 深度 | CSS 变量 | 用途 |
|------|---------|------|
| 0 最底层 | `--color-bg` | 页面背景 |
| 1 | `--color-surface` | 卡片、区块 |
| 2 | `--color-hover` | hover 态、浮层 |
| 3 | `--color-border` | 分割、边界 |

**不设 box-shadow**。暗色底 + 卡片背景色差 = 自然产生纵深。这是暗色 UI 最优雅的表达方式。

---

## 7. Animation & Interaction

### 动效档位：L2 流畅交互

### 7.1 全局

| 动效 | 实现 | 参数 |
|------|------|------|
| 平滑滚动 | Lenis | `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true` |
| 自定义光标 | CSS + JS | 8px 圆点，accent 色，hover 链接放大到 24px，`mix-blend-mode: difference`（可选） |
| 滚动进度 | CSS `scaleX` | 1px 高，`position: fixed; top: 0`，accent 色 |
| Header 模糊 | `backdrop-filter: blur(12px)` | 滚动 > 100px 触发 |

### 7.2 首页 Hero

| 动效 | 实现 | 参数 |
|------|------|------|
| 标题逐字出现 | CSS `@keyframes` + `animation-delay` stagger | 每字 50ms，总时长 ~1.5s |
| 副标题 fade-in | CSS `opacity` + `transform: translateY(10px)` | delay 0.6s, duration 0.8s |
| 鼠标视差 | vanilla JS `mousemove` | 标题 -5px, 副标题 -2px |
| SCROLL 指示器 | CSS `@keyframes` 脉冲 | opacity 0→1→0, 2s infinite |

### 7.3 滚动入场 (Scroll Reveal)

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

用 Intersection Observer 触发 `.visible`，`threshold: 0.15`。

作品卡片交替方向：
```css
.reveal-from-left  { transform: translateX(-40px); }
.reveal-from-right { transform: translateX(40px); }
.reveal-from-left.visible,
.reveal-from-right.visible { transform: translateX(0); }
```

### 7.4 卡片光晕（SpotlightCard）

mousemove 时用 `requestAnimationFrame` 更新 CSS 变量 `--mx` / `--my`，`::before` 伪元素 `radial-gradient` 跟随。

### 7.5 主题切换

覆盖层 `background-image` 0.6s `ease-in-out` 渐变。切换时 `documentElement.setAttribute('data-theme', ...)` 触发全部 CSS 变量过渡。

### 7.6 页面过渡

Astro View Transitions API：`<ViewTransitions />` 组件。默认 `fade` 过渡，duration 300ms。

### 7.7 签名动效清单（L2 硬性要求）

| 类别 | 落地位置 | 实现 |
|------|---------|------|
| Text Animation — Hero H1 | 首页 Hero | 逐字 stagger reveal（CSS animation-delay） |
| Text Animation — Section H2 | 各区块标题 | Scroll Reveal fadeInUp |
| Text Animation — Body / Label | 标签、日期 | Scroll Reveal |
| Animation — 元素级 | 作品卡片 | SpotlightCard hover 光晕 |
| Component — 交互构件 | 主题切换按钮 | 图标旋转 + 覆盖层渐变 |
| Background — 氛围层 | 全局 | 背景图轮播 + CSS 噪点纹理 |

### 7.8 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .bg-layer { background-attachment: scroll; }
}
```

---

## 8. Do's and Don'ts

### ✅ Do

1. **用 CSS 变量引用所有颜色**，零硬编码 hex
2. **Hero 标题大而有力**，正文小而清晰，对比拉开层次
3. **留白大胆**，宁可空着也不塞内容
4. **动效服务于理解**，不让用户等动画
5. **每区块一个背景图**，用 `data-bg-section` 标记
6. **自定义光标只在桌面端启用**（`matchMedia('(hover: hover)')`）
7. **Header 始终保持简洁**，logo + 3 个导航链接，不加多余的

### ❌ Don't

1. **不要居中大标题 + 居中副标题** —— AI 味的标志性布局
2. **不要紫色渐变** —— 与墨蓝/鸦青色板冲突
3. **不要使用 `filter: blur()` 在滚动元素上** —— 性能杀手
4. **不要图片纯色块占位** —— 用真实图库或至少 Unsplash URL
5. **不要 emoji 作为图标** —— 用 Lucide 或内联 SVG
6. **不要在移动端开启自定义光标**
7. **不要超过 2 个 `backdrop-filter` 元素** —— Safari 性能极差
8. **不要 `font-weight: 700` 以上** —— Inter 的 600+ 在中文下过于沉重
9. **不要连续三个 section 都一样布局** —— 每个 section 换一种排版节奏
10. **不要忘记 `focus-visible` 态** —— 键盘用户也是用户

---

## 9. Responsive Behavior

### 断点

| 断点 | 宽度 | 行为 |
|------|------|------|
| Mobile | ≤ 768px | 单列堆叠、缩小字号、隐藏自定义光标 |
| Tablet | 769px – 1024px | 双列网格保持、间距缩减 |
| Desktop | > 1024px | 完整布局 |

### Mobile 适配规则

```
□ 容器 padding: 40px → 24px
□ Hero 标题字号上限: 7vw → 10vw
□ 作品双列 → 单列，卡片圆角合并（首卡上圆角，末卡下圆角）
□ 文章列表日期+标题 → 上下堆叠，取消双列
□ 关于页左右分栏 → 上下堆叠
□ 背景图降级：不设置 background-attachment: fixed（iOS bug）
□ 触摸目标最小 44×44px
□ 自定义光标禁用
□ 区块 padding: 120px → 80px
```

### 移动端背景降级

```css
@media (max-width: 768px) {
  .bg-layer {
    background-attachment: scroll;
    /* 可选：完全用 CSS 渐变替代背景图以省带宽 */
    background-image:
      linear-gradient(var(--color-overlay), var(--color-overlay)),
      linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
  }
}
```

---

## 变更记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-07 | M0 产出，基于 SITE_V1_PLAN.md 设计令牌 |
