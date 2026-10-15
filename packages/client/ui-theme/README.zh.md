# @deepseek-ai/dsh-client-ui-theme

[English](README.md) | 中文

主题插件：基于 --dsw-* token 基础样式表（静态尺度 + 别名语义层）的 ThemeRuntime。该服务拥有实时主题偏好——内置的 `light`／`dark`／`system`，或任意一个已注册主题的 id——将 `system` 通过 `prefers-color-scheme` 解析为实际主题，并发布不可变的 `ThemeSnapshot`，通过 `theme/change` 事件通知变化；它绝不接触 DOM：ui-layout 的呈现器会应用解析后的快照（`html { color-scheme }`、`body[data-ds-dark-theme]`，以及主题的别名 token 内联变量）。来自回环地址的浏览器会先以 `system` 立即提供该服务，随后在后台加载持久化配置段，并将每次选择通过 Host settings API 写入；其本地提供方默认将设置存入 `$DSH_HOME/settings.yaml`。收到推送的 settings 变更时或重连后，浏览器都会重新拉取该设置；连续快速选择会按操作顺序携带 namespace revision 串行写入，最新写入被拒时则重新加载持久化值。远程浏览器无法访问特权 settings API，因此它的选择仅保留在进程内。该持久化边界由[Host settings 支撑的偏好决策](../../../.agents/notes/implemented/bug-fix/2026-08-06-host-backed-web-preferences.md)拥有。

该配置段有两个字段。`ui-theme.preference` 是选择本身，接受任意字符串：主题包的 id 必须能通过浏览器对持久化配置段的重新校验——封闭的联合类型会悄悄丢弃它，于是选择无法在重新加载后存活。`ui-theme.colorScheme` 是与该选择绘制同一套基础调色板的那个内置偏好：具名主题记录自己的 `colorScheme`，内置选择则重复自身，且只有 Host 引导脚本读取它。注册即持久化的准入门槛——`setTheme` 只接受已注册的 id 与 `system`，因此每个持久化的值都有某个插件能够还原。没有任何已注册主题应答的偏好（主题包尚未激活，或已不在组合中）会解析为操作系统默认调色板，同时保留自身的值，并在其主题包注册的那一刻立即生效；释放当前生效的主题只会把实时偏好重置为默认值，不触碰持久化的值，因此重新加载的主题包回来后仍处于选中状态。

当主机组合包含 HTTP 服务器时，主机侧紧接 `<body>` 起始标签注入同步引导代码。每份 index 响应在 `ui-theme.preference` 为内置值时嵌入它——早于该提示字段的配置文档，其引导行为与此前完全一致——否则嵌入 `ui-theme.colorScheme` 提示，没有 settings provider 时则嵌入 `system`；浏览器按操作系统配色解析 `system`，随后在外壳加载页面渲染前设置 `color-scheme` 和 `body[data-ds-dark-theme]`。因此深色主题包从第一帧起就是深色，不会先闪一下浅色调色板。主题 id 绝不会进入该脚本：它只认识内置的三个值，后续每一次 DOM 更新都归插件世界所有。不含 HTTP 服务器的组合不受影响，插件树激活后，ThemeRuntime 与 ui-layout 仍分别是客户端状态和后续 DOM 更新的权威来源。

`src/styles/` 下有五张样式表，全部由 web 壳的 `base.css` 导入：`base.css`、`design-platform.css`、`scrollbar.css`、`gradient-shadow-text.css` 与 `shiki.css`。`scrollbar.css` 是 `--dsw-alias-scrollbar-*` token 的唯一消费方，必须排在声明这些 token 的 `design-platform.css` 之后。

滚动条重新绑定约定：`scrollbar.css` 在 `body` 上把 `--dsh-scrollbar-thumb` 与 `--dsh-scrollbar-thumb-hover` 绑定到 l1（基础表面）token，两条渲染路径都读取这一组变量。高层级表面（菜单、浮层、对话框）在自己的容器上设置 `--dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2)` 与 `--dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2)`；一次重新绑定即可为引擎实际走的那条路径换色。这组变量的另一个合法目标是 `transparent`，即完全不绘制滑块——[ui-sidebar](../ui-sidebar/README.md) 在指针不在栏内时就这样重新绑定自己的列。绑回 l1 那组不算重新绑定，它只是重述基础表面的默认值。`--dsh-scrollbar-width` 镜像 WebKit 滚动条的布局宽度，供需要与占布局宽度的滚动条对齐的表面使用——[ui-conversation](../ui-conversation/README.md) 用它作为覆盖 composer 座位 `right` 偏移——scrollbar-styles 规格把它与镜像规则及消费者配对检查。

两条路径在构造上互斥。`scrollbar-width`／`scrollbar-color` 写在 `@supports not selector(::-webkit-scrollbar)` 之内，因为这两个属性中的任一个只要取非 `auto` 值，Chromium 与 Safari 就会丢弃该元素上的全部 `::-webkit-scrollbar*` 规则，`::-webkit-scrollbar-thumb:hover` 也在其中——若无条件地同时声明，`--dsh-scrollbar-thumb-hover` 在任何引擎上都不会被渲染。因此 Firefox 走标准属性，WebKit 系引擎走伪元素，hover token 只经由伪元素这条路径渲染。相关原理与实测计算值见[滚动条 Agent Note](../../../.agents/notes/implemented/bug-fix/2026-07-28-themed-scrollbars-and-reserved-gutter.md)。

## 模型体验

无。主题服务管理浏览器偏好；这里没有任何内容进入模型请求。

#### KV Cache 影响

无；该包既不组装也不发送提供方请求。

## 已知限制与暂缓事项

- **已注册主题是表层，不是目录**：注册主题意味着覆盖同名别名变量；目前不会验证一组覆盖是否完整。若某个持久化 id 对应的主题包已不在组合中，它仍会占据设置文档里的位置，界面则绘制操作系统默认调色板；没有任何机制会清理它。
- **首帧提示写于选择那一刻**：若某个主题在版本之间改了自己的 `colorScheme`，在下一次选择重写该提示之前，它会先按旧调色板绘制一帧。唯一的修复方式是重新选择该主题。
- **token 样式表是颜色值的唯一权威来源**：会有意不补入 cssdesign 中缺失的值（例如设计中的 #4176E6 标签页蓝色）；一律采用最接近的语义 token。设计负责人批准的新增值是例外：须在同一变更中以一个静态尺度层级与一个语义别名的形式进入（`--dsw-static-blue-900` / `--dsw-alias-label-primary-bluish`）。
