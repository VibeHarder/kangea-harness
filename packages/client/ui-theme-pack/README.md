# @deepseek-ai/dsh-client-ui-theme-pack

English | [中文](README.zh.md)

The Studio theme pack, a pure browser surface plugin. The browser half registers five palettes with [`ui-theme`](../ui-theme/README.md)'s registry and occupies the shell-declared `shell.background` seat with their artwork; the node half is an empty apply (the roster row). Removing the row leaves the built-in `light`/`dark` pair and an empty decorative seat, and the shell renders exactly as it did before the pack existed.

One kernel, five faces. A theme here is a flat token map plus a decorative layer, and the map is the only channel between them: it carries the `--dsw-*` palette overrides, the `--dsh-shell-*` surface rebinding that lets a backdrop show through the canvas at all, and the four `--dsh-backdrop-*` values (`base`, `veil`, `ink`, `accent`) the artwork paints with. Every token a theme leaves unset falls back to the base palette its `colorScheme` selects, so each map states differences rather than a full palette.

| Theme | Scheme | What it is |
| --- | --- | --- |
| `starlight` | dark | Midnight-blue leather roof: three star fields, two of them breathing on staggered cycles, a faint galaxy band, champagne gold as accent and never as fill. |
| `porcelain` | light | Restraint as decoration: pure white surfaces, hairline borders, one huge top bloom, an invisible grain. No motion at all. |
| `ink` | light | Xuan paper: bottom-anchored ridges in three depths, mist drifting on 48-76s cycles, a cinnabar seal, a serif type stack. |
| `sakura` | light | A Shinkai sky: vertical blue-to-sunset gradient, soft clouds, twelve petals falling on staggered 12-22s cycles. |
| `abyss` | dark | The professional default: no color override at all, only two still shafts of deep-sea light behind an opaque canvas. |

The backdrop is artwork and nothing else. Its seat is `aria-hidden` and pointer-transparent, so the tree carries no text, no focusable node, and no handler; a theme the pack does not draw — the built-ins, or an id another pack registered — renders the bare surface. The component reads only the resolved theme id, mirrored into its slot store by the plugin's `theme/change` listener, so `system` never reaches the artwork as a word: it arrives as whichever theme it resolved to.

Motion obeys the frame budget. Only `transform` and `opacity` animate, every animation lives behind `@media (prefers-reduced-motion: no-preference)` with a still composition answering `reduce`, and the layer takes `contain: strict` so repainting art cannot reach the columns' geometry while output streams into them. The [stylesheet spec](tests/backdrop-styles.client.spec.ts) pins those rules mechanically, including the absence of literal colors in the artwork: every color in the art files arrives as one of the four backdrop tokens.

Registration is the durability gate for a theme id, so both contributions are effects: the palettes leave the registry and the seat empties when this plugin unloads, while the user's durable selection survives — a reloaded pack comes back selected.

## Model Experience

None; the pack registers browser palettes and decorative artwork, and nothing here reaches a model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- **Artwork visibility depends on the surfaces above it.** A theme rebinds `--dsh-shell-surface` and `--dsh-shell-sidebar-surface` in its own map, but any feature surface still painting an opaque alias covers the layer under it; the pack cannot make a column translucent from here.
- **`ink` ships a font stack, not a font.** The serif that carries the theme is whatever the platform resolves from `Songti SC` / `Source Han Serif SC` / `Noto Serif CJK SC`; a host with none of them falls back to Georgia and the theme reads noticeably more Western.
- **Contrast is verified by construction, not by a gate.** The veil values were chosen against the body and secondary text of each palette; no automated check re-measures them when a token moves.
