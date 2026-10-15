# Studio 主题包 — 美术方向与调色规格

本文件是主题包的美术契约。实施 agent 按此执行；调色值不得即兴发挥。

## 总纲

一个内核，五种面貌。每套主题 = **一层 token 覆盖 + 一层装饰背景**，通过 `ctx.theme.register()` 注册，用户在设置里的主题画廊切换。

关键机制（已核实）：

- `ThemeDefinition = { id: string; colorScheme: 'light' | 'dark'; tokens: Record<string, string> }`，`tokens` 是**扁平字典**（不是 `{light,dark}` 对，那是 `overrideTokens()` 的要求）。
- `ThemePresenter.apply()` 把 `tokens` 逐条写成 `document.body.style.setProperty(name, value)` —— 因此 token 可以是**任意 CSS 自定义属性**，不限于颜色：字体栈、渐变、背景层参数都能通过它下发。
- 未覆盖的 token 自动回落到基础调色板（Abyss 的 light/dark）。**所以每套主题只需写差异**，不必重复定义全套。
- `colorScheme` 决定 `body[data-ds-dark-theme]`，进而决定回落用哪套基础值。

## 背景层契约

背景由一个独立组件渲染在整个应用之下，每套主题通过以下 token 驱动它（值由主题提供，组件只消费）：

| Token | 作用 |
| --- | --- |
| `--dsh-backdrop-base` | 背景层最底色/渐变（`background` 简写值） |
| `--dsh-backdrop-veil` | 覆盖在装饰之上的一层薄纱，用于压低对比保证文字可读（rgba 或 `transparent`） |
| `--dsh-backdrop-ink` | 装饰主色（山影、云、光点的着色） |
| `--dsh-backdrop-accent` | 装饰点缀色（星点、花瓣、霞光） |

背景组件按主题 id 切换自己的 CSS Module 类，决定画什么（星点/山峦/花瓣/无）。硬性要求：

- `position: fixed; inset: 0; pointer-events: none; z-index: 0;` 应用内容在其之上；
- 只用 **transform / opacity** 做动画（GPU 合成），禁止动画 `background-position`、`filter`、`box-shadow`；
- `contain: strict` 隔离重排，避免流式输出时反复重绘；
- 全部动画包在 `@media (prefers-reduced-motion: no-preference)` 里，减弱动效时呈现静态构图；
- `backdrop-filter` 最多用在**侧栏和输入框**两处，其余一律不用。

## 表面透明度契约

背景要可见，画布就必须让路。每套带背景的主题按此覆盖：

- `--dsw-alias-bg-base: transparent` —— 画布完全让位给背景层；
- `--dsw-specific-sidebar-fill` 与 `--dsw-specific-input-major` 改为 **rgba 半透明**（配合毛玻璃）；
- `--dsw-alias-bg-layer-1/2/3`（卡片、菜单、弹窗）保持**近乎不透明**，浮层必须够实才能读；
- 正文与背景的对比度不低于 4.5:1，次要文字不低于 3:1。达不到就加重 `--dsh-backdrop-veil`。

---

## 主题一：星穹 Starlight（劳斯莱斯星空顶）

`id: 'starlight'` · `colorScheme: 'dark'`

**概念**：午夜蓝黑的真皮车顶，光纤星点疏密有致地明灭。奢，但克制 —— 金只出现在点缀，绝不铺面。

**锚点色**

| Token | 值 | 说明 |
| --- | --- | --- |
| `--dsw-alias-bg-base` | `transparent` | 让位给星空 |
| `--dsw-alias-bg-layer-1` | `rgb(19, 23, 38)` | 卡片，午夜蓝 |
| `--dsw-alias-bg-layer-2` | `rgb(24, 29, 46)` | 次级面 |
| `--dsw-alias-bg-layer-3` | `rgb(30, 36, 56)` | 浮层 |
| `--dsw-alias-label-primary` | `rgb(237, 240, 250)` | 正文，冷白 |
| `--dsw-alias-label-secondary` | `rgb(176, 184, 208)` | |
| `--dsw-alias-label-tertiary` | `rgb(138, 147, 174)` | |
| `--dsw-alias-accent-primary` | `rgb(214, 190, 133)` | **香槟金** |
| `--dsw-alias-accent-soft` | `rgb(44, 40, 30)` | 金的暗底 |
| `--dsw-alias-ring` | `rgba(214, 190, 133, 0.42)` | 金色聚焦环 |
| `--dsw-alias-border-l1` | `rgba(214, 190, 133, 0.09)` | 描边带一丝金 |
| `--dsw-alias-border-l2` | `rgba(214, 190, 133, 0.16)` | |
| `--dsw-specific-sidebar-fill` | `rgba(13, 16, 28, 0.72)` | 毛玻璃 |
| `--dsw-specific-input-major` | `rgba(22, 27, 43, 0.82)` | 毛玻璃 |
| `--dsw-specific-bubble` | `rgb(30, 34, 52)` | 用户气泡 |
| `--dsw-alias-brand-primary` | `rgb(237, 240, 250)` | 主按钮仍为亮底墨字 |
| `--dsh-backdrop-base` | `radial-gradient(ellipse 140% 100% at 50% -20%, #1B2440 0%, #0C0F1C 55%, #07090F 100%)` | 天穹 |
| `--dsh-backdrop-veil` | `transparent` | 星点够暗，无需压 |
| `--dsh-backdrop-ink` | `rgba(255, 255, 255, 0.9)` | 星点主色 |
| `--dsh-backdrop-accent` | `rgba(214, 190, 133, 0.9)` | 金色星点 |

**背景做法**：三层 `radial-gradient` 星场（大/中/小三种星点密度，用多个 `radial-gradient(circle Npx at X% Y%, ...)` 拼成，各层 `background-size` 不同以获得非重复感），其中两层做 `opacity` 明灭动画（周期 5s / 8s，`animation-delay` 错开），金色星点只占约 1/8。顶部加一道极淡的银河带（长椭圆径向渐变，倾斜 -18deg）。禁止用 JS 逐帧绘制。

---

## 主题二：素瓷 Porcelain（苹果质感纯白）

`id: 'porcelain'` · `colorScheme: 'light'`

**概念**：克制到极致。没有装饰就是装饰 —— 大面积留白、发丝线、一点点光晕。质感来自精确，不来自元素。

**锚点色**

| Token | 值 | 说明 |
| --- | --- | --- |
| `--dsw-alias-bg-base` | `transparent` | 让位给极淡光晕 |
| `--dsw-alias-bg-layer-1` | `rgb(255, 255, 255)` | 纯白面 |
| `--dsw-alias-bg-layer-2` | `rgb(255, 255, 255)` | |
| `--dsw-alias-bg-layer-3` | `rgb(255, 255, 255)` | |
| `--dsw-alias-label-primary` | `rgb(29, 29, 31)` | 苹果墨 |
| `--dsw-alias-label-secondary` | `rgb(110, 110, 115)` | |
| `--dsw-alias-label-tertiary` | `rgb(134, 134, 139)` | |
| `--dsw-alias-accent-primary` | `rgb(0, 113, 227)` | 苹果蓝 |
| `--dsw-alias-accent-soft` | `rgb(240, 246, 255)` | |
| `--dsw-alias-ring` | `rgba(0, 113, 227, 0.32)` | |
| `--dsw-alias-border-l1` | `rgba(0, 0, 0, 0.05)` | 更轻的发丝线 |
| `--dsw-alias-border-l2` | `rgba(0, 0, 0, 0.09)` | |
| `--dsw-specific-sidebar-fill` | `rgba(245, 245, 247, 0.78)` | 苹果灰 + 毛玻璃 |
| `--dsw-specific-input-major` | `rgba(255, 255, 255, 0.86)` | |
| `--dsw-specific-bubble` | `rgb(242, 245, 250)` | 气泡极淡 |
| `--dsw-alias-markdown-code-block` | `rgb(247, 247, 249)` | |
| `--dsh-backdrop-base` | `linear-gradient(180deg, #FBFBFD 0%, #F5F5F7 100%)` | 苹果灰阶 |
| `--dsh-backdrop-veil` | `transparent` | |
| `--dsh-backdrop-ink` | `rgba(0, 113, 227, 0.05)` | 顶部一点冷光 |
| `--dsh-backdrop-accent` | `rgba(255, 255, 255, 0.9)` | |

**背景做法**：一道从顶部中央散开的巨大柔光（`radial-gradient(ellipse 120% 70% at 50% -10%)`，透明度极低），外加一层几乎看不见的颗粒（可用一张极小的 SVG noise 平铺，`opacity: 0.015`）。**不做任何动画** —— 静止本身就是这套主题的主张。

---

## 主题三：山水 Ink（水墨）

`id: 'ink'` · `colorScheme: 'light'`

**概念**：宣纸上的远山与留白。这是五套里最"反 SaaS"的一套，也是最容易出片的一套。

**锚点色**

| Token | 值 | 说明 |
| --- | --- | --- |
| `--dsw-alias-bg-base` | `transparent` | 让位给宣纸 |
| `--dsw-alias-bg-layer-1` | `rgba(253, 251, 246, 0.92)` | 纸面 |
| `--dsw-alias-bg-layer-2` | `rgb(250, 247, 240)` | |
| `--dsw-alias-bg-layer-3` | `rgb(252, 250, 245)` | |
| `--dsw-alias-label-primary` | `rgb(28, 26, 23)` | 墨 |
| `--dsw-alias-label-secondary` | `rgb(90, 84, 76)` | |
| `--dsw-alias-label-tertiary` | `rgb(124, 116, 105)` | |
| `--dsw-alias-accent-primary` | `rgb(158, 61, 50)` | **印章朱砂** |
| `--dsw-alias-accent-soft` | `rgb(247, 236, 232)` | |
| `--dsw-alias-ring` | `rgba(158, 61, 50, 0.3)` | |
| `--dsw-alias-border-l1` | `rgba(60, 50, 38, 0.1)` | 墨色描边 |
| `--dsw-alias-border-l2` | `rgba(60, 50, 38, 0.17)` | |
| `--dsw-specific-sidebar-fill` | `rgba(244, 239, 228, 0.8)` | 略深的纸 |
| `--dsw-specific-input-major` | `rgba(253, 251, 246, 0.9)` | |
| `--dsw-specific-bubble` | `rgb(243, 237, 225)` | |
| `--dsw-alias-markdown-code-block` | `rgb(246, 242, 233)` | |
| `--dsw-font-family` | `'Songti SC', 'Source Han Serif SC', 'Noto Serif CJK SC', Georgia, serif` | **换宋体，气质靠它** |
| `--dsh-backdrop-base` | `linear-gradient(180deg, #FBF7EE 0%, #F5EFE2 100%)` | 宣纸 |
| `--dsh-backdrop-veil` | `rgba(251, 247, 238, 0.55)` | 压住山影保可读 |
| `--dsh-backdrop-ink` | `rgba(46, 42, 38, 0.16)` | 山色 |
| `--dsh-backdrop-accent` | `rgba(158, 61, 50, 0.5)` | 朱印 |

**背景做法**：底部锚定三层远山剪影（内联 SVG path，近山最深、远山最淡，层间留白作云雾），山腰横几道水平雾带（线性渐变），右上角一枚淡朱砂圆（月/印），纸面叠一层极淡颗粒。山峦**静止**；仅雾带做极缓慢的水平位移（`transform: translateX`，周期 ≥ 40s）。

---

## 主题四：樱色 Sakura（动漫）

`id: 'sakura'` · `colorScheme: 'light'`

**概念**：新海诚式的天空 —— 高饱和的蓝、地平线的暖霞、飘落的花瓣。五套里最"跳"的一套，用来抓眼球。

**锚点色**

| Token | 值 | 说明 |
| --- | --- | --- |
| `--dsw-alias-bg-base` | `transparent` | 让位给天空 |
| `--dsw-alias-bg-layer-1` | `rgba(255, 255, 255, 0.9)` | 白面（略透，透出天色） |
| `--dsw-alias-bg-layer-2` | `rgb(255, 253, 254)` | |
| `--dsw-alias-bg-layer-3` | `rgb(255, 255, 255)` | |
| `--dsw-alias-label-primary` | `rgb(40, 44, 74)` | 深靛，不用纯黑 |
| `--dsw-alias-label-secondary` | `rgb(96, 102, 138)` | |
| `--dsw-alias-label-tertiary` | `rgb(132, 138, 170)` | |
| `--dsw-alias-accent-primary` | `rgb(233, 108, 148)` | **樱粉** |
| `--dsw-alias-accent-soft` | `rgb(255, 240, 245)` | |
| `--dsw-alias-ring` | `rgba(233, 108, 148, 0.36)` | |
| `--dsw-alias-border-l1` | `rgba(64, 76, 128, 0.08)` | |
| `--dsw-alias-border-l2` | `rgba(64, 76, 128, 0.14)` | |
| `--dsw-specific-sidebar-fill` | `rgba(240, 245, 255, 0.72)` | 天色玻璃 |
| `--dsw-specific-input-major` | `rgba(255, 255, 255, 0.88)` | |
| `--dsw-specific-bubble` | `rgb(255, 238, 244)` | 粉气泡 |
| `--dsw-alias-markdown-code-block` | `rgb(246, 248, 255)` | |
| `--dsh-backdrop-base` | `linear-gradient(180deg, #7FB4E8 0%, #BBD9F2 42%, #F6DCE0 78%, #FBEFE4 100%)` | 天空到霞 |
| `--dsh-backdrop-veil` | `rgba(255, 255, 255, 0.5)` | 压亮保可读 |
| `--dsh-backdrop-ink` | `rgba(255, 255, 255, 0.85)` | 云 |
| `--dsh-backdrop-accent` | `rgba(233, 108, 148, 0.75)` | 花瓣 |

**背景做法**：竖直天空渐变打底，中部几团柔云（大半径 `radial-gradient` 白色团块，边缘极软），10–14 片花瓣（纯 CSS 元素，`border-radius` 捏出花瓣形，`transform: translate3d + rotate` 缓慢飘落，周期 12–22s 错开）。花瓣是唯一持续动画，元素数量**不得超过 14**。

---

## 主题五：深渊 Abyss（默认）

`id: 'abyss'` · `colorScheme: 'dark'`

保持现有深色调色板不变（**不覆盖任何颜色 token**，全部回落到基础深色）。仅提供一层极淡的深海背景：

| Token | 值 |
| --- | --- |
| `--dsh-backdrop-base` | `radial-gradient(ellipse 120% 90% at 50% -10%, #1D2434 0%, #141720 60%, #101319 100%)` |
| `--dsh-backdrop-veil` | `transparent` |
| `--dsh-backdrop-ink` | `rgba(122, 158, 255, 0.05)` |
| `--dsh-backdrop-accent` | `rgba(122, 158, 255, 0.09)` |

**背景做法**：顶部两道极淡的斜向光柱（模拟海面透光），静止不动。`--dsw-alias-bg-base` 保持不透明（沿用基础值），因此这套背景只在边缘隐约可见 —— 它是"默认专业档"，不喧宾夺主。

---

## 内置 light / dark

`light` 和 `dark` 是引擎内置的两个 id，画廊里照常列出，背景层对它们**不渲染任何装饰**（`--dsh-backdrop-*` 不定义时组件降级为纯色）。

## 主题画廊 UI

设置 → 通用里，在现有「外观」行之后加一个**主题画廊**：

- 网格卡片（每行 3 个），每张卡是该主题的**微缩预览**：用该主题的 token 画一个 3 行的迷你界面骨架（侧栏条 + 两行内容 + 一个强调色圆点）+ 该主题的背景色；
- 选中态：2px `accent-primary` 描边 + 右上角对勾；
- 卡片下方是主题中文名 + 英文 id（如「星穹 Starlight」）；
- 悬停时卡片轻微上浮（`translateY(-2px)` + 阴影升一档），0.2s；
- 切换即时生效，无需刷新；
- 文案走 locale（zh + en 都要给）。

## 验收口径

每套主题都要在这些场景下检查：空状态、活跃会话（工具卡片 + 代码块）、模型选择弹层、设置窗。正文对比度不达标、背景动画导致流式输出掉帧、切换主题后残留上一套的 token —— 任一出现即不合格。
