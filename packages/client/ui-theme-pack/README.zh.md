# @deepseek-ai/dsh-client-ui-theme-pack

[English](README.md) | 中文

Studio 主题包，纯浏览器 surface 插件。浏览器侧向 [`ui-theme`](../ui-theme/README.md) 的注册表注册五套主题，并以它们的美术占用外壳声明的 `shell.background` seat；node 侧是空 apply（roster 行）。移除该行后只剩内置的 `light`/`dark` 与一个空的装饰 seat，外壳的渲染与本包出现之前完全一致。

一个内核，五种面貌。这里的一套主题 = 一张扁平 token 字典 + 一层装饰背景，而字典是二者之间唯一的通道：它承载 `--dsw-*` 调色覆盖、让背景能透出画布的 `--dsh-shell-*` 表面改绑，以及美术作画所用的四个 `--dsh-backdrop-*` 值（`base`、`veil`、`ink`、`accent`）。主题未设置的 token 一律回落到其 `colorScheme` 选中的基础调色板，因此每张字典写的是差异，而不是一整套调色板。

| 主题 | 配色 | 是什么 |
| --- | --- | --- |
| `starlight` | dark | 午夜蓝真皮车顶：三层星场，其中两层以错开的周期明灭，一道极淡银河带，香槟金只做点缀、绝不铺面。 |
| `porcelain` | light | 克制即装饰：纯白面、发丝线、一道巨大顶部柔光、一层看不见的颗粒。完全没有动效。 |
| `ink` | light | 宣纸：底部锚定的三层远山、以 48–76s 周期漂移的雾带、一枚朱砂印、一套宋体字栈。 |
| `sakura` | light | 新海诚式天空：竖直的蓝到霞渐变、柔云、十二片以 12–22s 错开周期飘落的花瓣。 |
| `abyss` | dark | 专业默认档：不覆盖任何颜色，只在不透明画布之后放两道静止的深海光柱。 |

背景层只是美术，别无其他。它的 seat 带 `aria-hidden` 且不接收指针，因此这棵树没有文字、没有可聚焦节点、没有事件处理器；本包不作画的主题——内置两套，或别的包注册的 id——渲染为纯表面。组件只读取解析后的主题 id（由插件的 `theme/change` 监听镜像进 slot store），因此 `system` 永远不会以字面量抵达美术层：抵达的是它解析成的那套主题。

动效遵守帧预算。只有 `transform` 与 `opacity` 参与动画，每条动画都放在 `@media (prefers-reduced-motion: no-preference)` 之后并由 `reduce` 分支给出静态构图，图层带 `contain: strict`，使重绘的美术无法在流式输出期间波及各栏的几何。[样式规格](tests/backdrop-styles.client.spec.ts)以机械方式钉住这些规则，包括美术文件中不得出现字面颜色：美术里的每个颜色都来自那四个背景 token 之一。

注册即主题 id 的持久化闸门，因此两项贡献都是 effect：插件卸载时主题离开注册表、seat 清空，而用户的持久选择仍在——重新加载的主题包会带着选中态回来。

## 模型体验

无。本包注册浏览器调色板与装饰美术，这里没有任何内容进入模型请求。

#### KV Cache 影响

无；该包既不组装也不发送提供方请求。

## 已知局限与延后工作

- **美术是否可见取决于其上的表面**：主题会在自己的字典里改绑 `--dsh-shell-surface` 与 `--dsh-shell-sidebar-surface`，但任何仍绘制不透明别名的功能表面都会盖住其下的图层；本包无法从这里把某一栏改成半透明。
- **`ink` 提供的是字体栈，不是字体**：撑起这套主题的衬线体取决于平台从 `Songti SC` / `Source Han Serif SC` / `Noto Serif CJK SC` 解析到什么；三者皆无的机器回落到 Georgia，气质会明显偏西式。
- **对比度由构造保证，而非由 gate 保证**：veil 的取值是对着每套调色板的正文与次要文字选定的；token 变动时没有自动检查会重新测量。
