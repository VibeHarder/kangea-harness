# DSH Web UI 精品化设计规格（Abyss / 深海曜石）

本文件是本次 UI 改造的唯一设计契约。所有界面 agent 按此执行；与本文件冲突的即兴发挥一律不做。

## 设计概念

**深海曜石（Abyss）**：呼应 DeepSeek 的深海鲸鱼意象。浅色模式是"墨与瓷"——雾蓝底、纯白面、墨黑字、蓝宝石点缀；深色模式是"深渊"——蓝黑色海渊层次、玻璃质感面板、克制的辉光。精致感来自：发丝线描边（hairline border）取代灰色填充、分层柔和阴影、收敛的圆角阶、统一的动效节奏、等宽字体作为工具卡片的设计元素。

## 硬性规则（每个 agent 必须遵守）

1. 组件 CSS 一律 CSS Modules + `var(--dsw-*)` 语义令牌；**禁止字面量颜色**（rgba/hex 一律不准出现在组件 css 里；透明度效果用现有 mask/hover 令牌）。
2. **不改 `packages/client/ui-theme/` 下任何文件**（令牌层由主控统一维护）。缺令牌时用最接近的现有令牌并在汇报中说明。
3. 不改组件行为、不改 slot 结构、不新增 /client 出口、不加依赖、不动 locales 键；类名增删可以，测试断言的是行为不是类名。
4. 每个文件收尾恰好一个换行符；代码注释用英文；只在自己的文件清单范围内动手。
5. 状态语义保留：琥珀点=待交互、蓝点=运行中、绿点=完成提醒；错误红/成功绿/警告琥珀的语义映射不得改变。
6. 完成后跑 `pnpm run test:gui`（PATH 前缀 `/Users/douya/.nvm/versions/node/v24.19.0/bin`），必须全绿才算完成。

## 令牌层（已由主控改好，直接使用）

关键语义令牌（值已是新设计，无需关心具体色值）：

- 面：`--dsw-alias-bg-base`（画布）/ `bg-layer-1/2/3`（浮层递进）/ `--dsw-specific-sidebar-fill`
- 线：`--dsw-alias-border-l1`（发丝线）/ `l2`（标准）/ `l3/l4`（强调）
- 字：`--dsw-alias-label-primary/secondary/tertiary/caption`
- 点缀（蓝宝石）：`--dsw-alias-accent-primary`、`--dsw-alias-accent-soft`（浅底）、`--dsw-alias-ring`（focus 环）
- 阴影：`--dsw-shadow-lv1`（贴面）/ `lv2`（卡片）/ `lv3`(浮层) / `--dsw-shadow-composer`（输入框专属）/ `--dsw-shadow-glow-accent`（主按钮辉光）
- 圆角：`--dsw-radius-s: 8px` / `m: 12px` / `l: 16px` / `xl: 22px` / `full`
- 动效：`--ds-transition-duration-fast/0.1s`、`/0.2s`、`-slow/0.3s` + `--ds-ease-in-out`
- 字阶：沿用 `--dsw-font-*` 全套（markdown 阶、UI 阶 s-14/xs-13/xxs-12 等）
- 悬停：`--dsw-alias-interactive-bg-hover`（弱）/ `-solid`（实底）/ `-accent`、`bg-active`

## 通用手法（各 surface 一致执行）

- **卡片**：`bg-layer-1` + `1px solid var(--dsw-alias-border-l1)` + `--dsw-shadow-lv2` + `--dsw-radius-l`；悬停时边线升到 `l2`、阴影不变（克制）。
- **浮层**（菜单/弹窗/tooltip）：`bg-layer-3` + `border-l2` + `--dsw-shadow-lv3` + `--dsw-radius-m`；出场动画 0.1s ease 淡入 + 2px 上移。
- **focus-visible**：`outline: 2px solid var(--dsw-alias-ring); outline-offset: 2px;` 全局一致，禁止 outline:none 裸奔。
- **过渡**：颜色/边框/阴影过渡 0.2s，transform 0.1s；不加弹跳类花哨动效。
- **图标按钮**：36px 方形热区、`--dsw-radius-s`、hover 用 `interactive-bg-hover`。
- 细节偏好：分隔用空间和发丝线而非粗灰条；文字层级用颜色（primary/secondary/tertiary）+ 字重表达，少用字号跳变。

## Surface A：外壳与侧栏（ui-layout + ui-sidebar + ui-workspace）

目标：从"白灰分栏"升级为"瓷面画布 + 静谧侧栏面板"。

- 侧栏整体 `--dsw-specific-sidebar-fill`，与画布交界处用 `border-l1` 发丝线；收起 rail 保持现几何常量（TS 里的 56px/280px/动效毫秒数不许改）。
- 顶部品牌区：logo 行留白加大（上下 16px），HARNESS 徽标做成 `accent-soft` 底 + `accent-primary` 字的小胶囊。
- "新会话"按钮 → 主操作卡：`bg-layer-1` + 发丝线 + `lv1` 阴影 + `radius-m`，hover 升 `lv2` 并微微上移 1px。
- 工作区分组标题（"工作区"）：`xxs-strong-12` + `label-caption` + 0.04em letter-spacing，图标按钮排布右对齐。
- 会话行：`radius-s`，选中态用 `interactive-bg-active` + 左侧 2px `accent-primary` 指示条（伪元素），hover 用 `interactive-bg-hover`；时间戳 `label-caption`；状态点保持语义色但缩到 6px、加同色 30% 外圈光晕。
- AppFrame 三栏：中央画布 `bg-base`；栏间拖拽把手 hover 时显示 `accent-primary` 细线。
- 设置行（底部）：与会话行同语言。

## Surface B：会话流（ui-conversation 除 skeleton/ 外 + ui-message-feedback）

目标：把"平铺行"变成有节奏的对话叙事；工具调用是精致的等宽卡片组。

- 会话头部（标题 + 对话/轨迹 tab + Session log 按钮)：标题 `m-18`；tab 选中态下划线改为 2px `accent-primary` 圆头短线（宽度=文字宽），切换 0.2s 滑动；Session log 按钮改幽灵按钮（发丝线 + hover 实底）。
- 用户消息:右对齐胶囊卡，`--dsw-specific-bubble` 底 + `radius-l`（右下角 `radius-s` 做"尾巴"差异），最大宽 76%。
- 助手消息：无底色直排（保持），但左侧加 2px 透明轨道，流式进行中变 `accent-soft` 呼吸微光（opacity 0.4→1 交替 1.6s）；markdown 排版严格用 `--dsw-font-markdown-*` 阶。
- 工具节点（Think/Glob/Bash/Read/...）：改为紧凑卡片行——图标托在 20px `accent-soft` 圆角小方块里着 `accent-primary` 色；工具名 `s-strong-14`；参数/摘要用 `--dsw-font-markdown-code`（等宽！）着 `label-tertiary`；整行 hover 出发丝线卡片底（`bg-layer-1` + `border-l1`）；展开态卡片内容区 `markdown-code-block-banner` 底 + 上发丝线。连续工具行之间 4px 间距，与文字消息之间 16px。
- 运行中指示（"Deep diving..."）：等宽小字 + 前置 6px 呼吸点（accent-primary），不用大号蓝字。
- 代码块：`markdown-code-block` 底 + 发丝线 + `radius-m`；顶部语言条 `code-block-banner` 底 + `xxs-12` 语言标签 + 复制按钮幽灵化；行高按 `--dsw-font-markdown-code-block`。
- 消息元信息条（复制/点赞/时间/token 速率）：默认 40% 透明度，hover 该消息时恢复；图标按钮统一 28px。
- 底部统计条（轮/步/LLM 时延/tok/s）：`xxs-12` + `label-caption`，分隔符用 4px 中点，贴条底部加发丝线与画布分离；数字用等宽字体（`--ds-font-family-code`）。

## Surface C：输入区与英雄区（ui-conversation/src/client/skeleton/** + ui-model-selection + ui-agent-preset）

目标：输入框是全界面的主角——一块悬浮的"曜石"。

- composer 卡：`--dsw-specific-input-major` 底 + 发丝线 + `--dsw-shadow-composer` + `radius-xl`；聚焦时描边换 `accent-primary` 1px + `--dsw-alias-ring` 3px 外环（box-shadow 叠加，0.2s）。
- 发送按钮：36px 圆形 `accent-primary` 底白箭头，可发送态挂 `--dsw-shadow-glow-accent`，hover 亮度提升 + scale(1.04)，禁用态 `label-dimmed` 底。
- 左下 + 按钮与权限章（Workspace Write）、右下模型选择器：统一小胶囊语言——发丝线 + `radius-full` + `xs-13`，hover 实底；模型名 `s-strong-14`，推理档位（High）用 `accent-primary` 小字。
- 英雄区（空状态）：鲸鱼 logo + "探索未至之境"标题组重排——logo 32px 与标题基线对齐，标题 `xl-24` 但 letter-spacing -0.01em；"预览版"徽标与 HARNESS 徽标同语言（accent-soft 胶囊）；工作区/模式两个选择器胶囊与 composer 左右对齐排一行；hero 态 composer 阴影更深一档并预留呼吸空间（上下留白加大）。
- 审批/提问面板（composer 链占位）：与 composer 同卡片语言，按钮主次分明（主=墨色实底、次=幽灵）。

## Surface D：基元与设置（ui-primitives + schema-form + ui-attachment + ui-settings-general）

目标：把共享基元一次修好，全局受益。注意这些是 shell 包（vite 打包），改完由主控 build:web。

- Button 基元：主按钮（墨底白字，hover 微降不透明度）、次按钮（发丝线幽灵）、危险按钮（`state-error-primary` 仅描边，hover 才实底）；统一 `radius-m`、字 `s-strong-14`、水平 padding 14px。
- 菜单/Popover/Tooltip：按"通用手法·浮层"执行；菜单项 32px 高 `radius-s`，选中打勾用 `accent-primary`；tooltip 深底白字 `xxs-12` + `radius-s`，出场 0.1s。
- 对话框（如内测声明）：`bg-layer-2` + `lv3` + `radius-xl`，标题 `l-20`，遮罩用 `bg-mask-1` + `--dsw-mask-blur`。
- CodeBlock 基元 chrome 若在本包（shiki 容器），与 Surface B 的代码块规格保持一致。
- Toast：深底（`toast-bg`）白字 + `radius-m` + `lv3`，进出场 0.2s 上滑淡入。
- 设置窗（SettingsRoot 1080×700）：左导航列改 `sidebar-fill` 底，导航项与侧栏会话行同语言（含选中左指示条）；内容区分组卡片化（卡片规格见通用手法）；表单控件（schema-form）：输入框发丝线 + focus ring、开关用 `accent-primary` 选中色、下拉与菜单同语言。
- 附件芯片（ui-attachment）：胶囊发丝线 + 文件图标 `accent-primary`。

## 验收口径

主控将在浅/深两种模式下截图检查：空状态、活跃会话（含工具卡片/代码块）、弹层（模型选择、设置窗）、审批面板。不合格项回炉。
