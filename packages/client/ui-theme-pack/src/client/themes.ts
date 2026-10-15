/**
 * The five Studio palettes, as flat `--dsw-*` / `--dsh-*` token maps.
 *
 * A theme states only what genuinely differs from the base palette its
 * `colorScheme` selects: every unset token falls back to
 * `ui-theme/src/styles/design-platform.css`, and tokens defined there as
 * `var(--dsw-alias-…)` follow whatever this map rebinds (so overriding
 * `bg-layer-3` also moves `--dsw-specific-menu`, which is why menus are absent
 * below). Literal color values are correct HERE and nowhere else in the
 * package: this file is the palette, the artwork consumes it through
 * `--dsh-backdrop-*`.
 *
 * Beyond the anchors fixed by the art contract, each map carries the derived
 * neighbourhood a theme needs to stay internally coherent — hover and active
 * fills, code surfaces, scrollbars, toast/tooltip, bubbles, selectors — so a
 * warm paper theme never keeps a cold blue-grey hover.
 */
// Type-only: the theme registry's definition shape. Cross-plugin collaboration
// goes through ctx.theme at runtime, never a value import.
import type { ThemeDefinition } from '@deepseek-ai/dsh-client-ui-theme/client'

/**
 * Starlight: a midnight-blue leather roof with fibre-optic stars. Champagne
 * gold is the accent and never a fill — borders, rings, and hovers carry a
 * trace of it so the whole shell reads as one material.
 */
const STARLIGHT: ThemeDefinition = {
  id: 'starlight',
  colorScheme: 'dark',
  tokens: {
    '--dsw-alias-bg-base': 'transparent',
    '--dsw-alias-bg-layer-1': 'rgb(19, 23, 38)',
    '--dsw-alias-bg-layer-2': 'rgb(24, 29, 46)',
    '--dsw-alias-bg-layer-3': 'rgb(30, 36, 56)',
    '--dsw-alias-bg-overlay': 'rgb(38, 45, 68)',
    '--dsw-alias-bg-module-platform': 'rgb(24, 29, 46)',
    '--dsw-alias-label-primary': 'rgb(237, 240, 250)',
    '--dsw-alias-label-secondary': 'rgb(176, 184, 208)',
    '--dsw-alias-label-tertiary': 'rgb(138, 147, 174)',
    '--dsw-alias-label-caption': 'rgb(120, 129, 156)',
    '--dsw-alias-accent-primary': 'rgb(214, 190, 133)',
    '--dsw-alias-accent-soft': 'rgb(44, 40, 30)',
    '--dsw-alias-ring': 'rgba(214, 190, 133, 0.42)',
    '--dsw-alias-border-l1': 'rgba(214, 190, 133, 0.09)',
    '--dsw-alias-border-l2': 'rgba(214, 190, 133, 0.16)',
    '--dsw-alias-border-l3': 'rgba(214, 190, 133, 0.22)',
    '--dsw-alias-border-l4': 'rgba(214, 190, 133, 0.3)',
    '--dsw-alias-brand-primary': 'rgb(237, 240, 250)',
    '--dsw-alias-interactive-bg-hover': 'rgba(214, 190, 133, 0.08)',
    '--dsw-alias-interactive-bg-active': 'rgba(214, 190, 133, 0.14)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(214, 190, 133, 0.2)',
    '--dsw-alias-interactive-bg-hover-solid': 'rgb(30, 36, 56)',
    '--dsw-alias-markdown-code-block': 'rgb(14, 18, 31)',
    '--dsw-alias-markdown-code-block-banner': 'rgb(19, 23, 38)',
    '--dsw-alias-markdown-inline-code': 'rgb(30, 36, 56)',
    '--dsw-alias-markdown-citation': 'rgb(30, 36, 56)',
    '--dsw-alias-markdown-tag': 'rgb(24, 29, 46)',
    '--dsw-alias-markdown-placeholder': 'rgb(24, 29, 46)',
    '--dsw-alias-scrollbar-bg-l1': 'rgba(214, 190, 133, 0.16)',
    '--dsw-alias-scrollbar-bg-l2': 'rgba(214, 190, 133, 0.12)',
    '--dsw-alias-scrollbar-hover-l1': 'rgba(214, 190, 133, 0.3)',
    '--dsw-alias-scrollbar-hover-l2': 'rgba(214, 190, 133, 0.26)',
    '--dsw-alias-toast-bg': 'rgb(30, 36, 56)',
    '--dsw-alias-tooltip-bg': 'rgb(30, 36, 56)',
    '--dsw-specific-sidebar-fill': 'rgba(13, 16, 28, 0.72)',
    '--dsw-specific-input-major': 'rgba(22, 27, 43, 0.82)',
    '--dsw-specific-bubble': 'rgb(30, 34, 52)',
    '--dsw-specific-bubble-highlight': 'rgb(44, 40, 30)',
    '--dsw-specific-selector': 'rgb(24, 29, 46)',
    '--dsw-specific-tip': 'rgb(24, 29, 46)',
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(214, 190, 133, 0.08)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(214, 190, 133, 0.14)',
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgba(214, 190, 133, 0.2)',
    '--dsh-shell-surface': 'transparent',
    '--dsh-shell-sidebar-surface': 'rgba(13, 16, 28, 0.72)',
    '--dsh-backdrop-base': 'radial-gradient(ellipse 140% 100% at 50% -20%, #1B2440 0%, #0C0F1C 55%, #07090F 100%)',
    '--dsh-backdrop-veil': 'transparent',
    '--dsh-backdrop-ink': 'rgba(255, 255, 255, 0.9)',
    '--dsh-backdrop-accent': 'rgba(214, 190, 133, 0.9)',
  },
}

/**
 * Porcelain: restraint as the decoration. Pure white surfaces, hairline
 * borders, neutral (never bluish) greys, and one cold bloom at the top.
 */
const PORCELAIN: ThemeDefinition = {
  id: 'porcelain',
  colorScheme: 'light',
  tokens: {
    '--dsw-alias-bg-base': 'transparent',
    '--dsw-alias-bg-layer-1': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-layer-2': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-layer-3': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-overlay': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-module-platform': 'rgb(250, 250, 252)',
    '--dsw-alias-label-primary': 'rgb(29, 29, 31)',
    '--dsw-alias-label-secondary': 'rgb(110, 110, 115)',
    '--dsw-alias-label-tertiary': 'rgb(134, 134, 139)',
    '--dsw-alias-label-caption': 'rgb(160, 160, 166)',
    '--dsw-alias-accent-primary': 'rgb(0, 113, 227)',
    '--dsw-alias-accent-soft': 'rgb(240, 246, 255)',
    '--dsw-alias-ring': 'rgba(0, 113, 227, 0.32)',
    '--dsw-alias-border-l1': 'rgba(0, 0, 0, 0.05)',
    '--dsw-alias-border-l2': 'rgba(0, 0, 0, 0.09)',
    '--dsw-alias-border-l3': 'rgba(0, 0, 0, 0.12)',
    '--dsw-alias-border-l4': 'rgba(0, 0, 0, 0.16)',
    '--dsw-alias-brand-primary': 'rgb(29, 29, 31)',
    '--dsw-alias-interactive-bg-hover': 'rgba(0, 0, 0, 0.04)',
    '--dsw-alias-interactive-bg-active': 'rgba(0, 0, 0, 0.07)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(0, 113, 227, 0.1)',
    '--dsw-alias-interactive-bg-hover-solid': 'rgb(245, 245, 247)',
    '--dsw-alias-markdown-code-block': 'rgb(247, 247, 249)',
    '--dsw-alias-markdown-code-block-banner': 'rgb(242, 242, 245)',
    '--dsw-alias-markdown-inline-code': 'rgb(242, 242, 245)',
    '--dsw-alias-markdown-citation': 'rgb(245, 245, 247)',
    '--dsw-alias-markdown-tag': 'rgb(245, 245, 247)',
    '--dsw-alias-markdown-placeholder': 'rgb(247, 247, 249)',
    '--dsw-alias-scrollbar-bg-l1': 'rgba(0, 0, 0, 0.16)',
    '--dsw-alias-scrollbar-bg-l2': 'rgba(0, 0, 0, 0.16)',
    '--dsw-alias-scrollbar-hover-l1': 'rgba(0, 0, 0, 0.28)',
    '--dsw-alias-scrollbar-hover-l2': 'rgba(0, 0, 0, 0.28)',
    '--dsw-alias-toast-bg': 'rgb(29, 29, 31)',
    '--dsw-alias-tooltip-bg': 'rgb(29, 29, 31)',
    '--dsw-specific-sidebar-fill': 'rgba(245, 245, 247, 0.78)',
    '--dsw-specific-input-major': 'rgba(255, 255, 255, 0.86)',
    '--dsw-specific-bubble': 'rgb(242, 245, 250)',
    '--dsw-specific-bubble-highlight': 'rgb(224, 236, 255)',
    '--dsw-specific-selector': 'rgb(245, 245, 247)',
    '--dsw-specific-tip': 'rgb(245, 245, 247)',
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(0, 0, 0, 0.04)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(0, 0, 0, 0.07)',
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgb(240, 246, 255)',
    '--dsh-shell-surface': 'transparent',
    '--dsh-shell-sidebar-surface': 'rgba(245, 245, 247, 0.78)',
    '--dsh-backdrop-base': 'linear-gradient(180deg, #FBFBFD 0%, #F5F5F7 100%)',
    '--dsh-backdrop-veil': 'transparent',
    '--dsh-backdrop-ink': 'rgba(0, 113, 227, 0.05)',
    '--dsh-backdrop-accent': 'rgba(255, 255, 255, 0.9)',
  },
}

/**
 * Ink: distant mountains on xuan paper. The serif stack carries most of the
 * character; every grey is warmed toward the paper and the single saturated
 * value is the seal's cinnabar.
 */
const INK: ThemeDefinition = {
  id: 'ink',
  colorScheme: 'light',
  tokens: {
    '--dsw-alias-bg-base': 'transparent',
    '--dsw-alias-bg-layer-1': 'rgba(253, 251, 246, 0.92)',
    '--dsw-alias-bg-layer-2': 'rgb(250, 247, 240)',
    '--dsw-alias-bg-layer-3': 'rgb(252, 250, 245)',
    '--dsw-alias-bg-overlay': 'rgb(250, 246, 238)',
    '--dsw-alias-bg-module-platform': 'rgb(248, 243, 233)',
    '--dsw-alias-label-primary': 'rgb(28, 26, 23)',
    '--dsw-alias-label-secondary': 'rgb(90, 84, 76)',
    '--dsw-alias-label-tertiary': 'rgb(124, 116, 105)',
    '--dsw-alias-label-caption': 'rgb(150, 142, 130)',
    '--dsw-alias-accent-primary': 'rgb(158, 61, 50)',
    '--dsw-alias-accent-soft': 'rgb(247, 236, 232)',
    '--dsw-alias-ring': 'rgba(158, 61, 50, 0.3)',
    '--dsw-alias-border-l1': 'rgba(60, 50, 38, 0.1)',
    '--dsw-alias-border-l2': 'rgba(60, 50, 38, 0.17)',
    '--dsw-alias-border-l3': 'rgba(60, 50, 38, 0.22)',
    '--dsw-alias-border-l4': 'rgba(60, 50, 38, 0.28)',
    '--dsw-alias-brand-primary': 'rgb(38, 34, 30)',
    '--dsw-alias-interactive-bg-hover': 'rgba(60, 50, 38, 0.05)',
    '--dsw-alias-interactive-bg-active': 'rgba(60, 50, 38, 0.09)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(158, 61, 50, 0.1)',
    '--dsw-alias-interactive-bg-hover-solid': 'rgb(246, 241, 231)',
    '--dsw-alias-markdown-code-block': 'rgb(246, 242, 233)',
    '--dsw-alias-markdown-code-block-banner': 'rgb(241, 235, 223)',
    '--dsw-alias-markdown-inline-code': 'rgb(243, 238, 227)',
    '--dsw-alias-markdown-citation': 'rgb(243, 238, 227)',
    '--dsw-alias-markdown-tag': 'rgb(243, 238, 227)',
    '--dsw-alias-markdown-placeholder': 'rgb(246, 242, 233)',
    '--dsw-alias-scrollbar-bg-l1': 'rgba(60, 50, 38, 0.18)',
    '--dsw-alias-scrollbar-bg-l2': 'rgba(60, 50, 38, 0.18)',
    '--dsw-alias-scrollbar-hover-l1': 'rgba(60, 50, 38, 0.3)',
    '--dsw-alias-scrollbar-hover-l2': 'rgba(60, 50, 38, 0.3)',
    '--dsw-alias-toast-bg': 'rgb(45, 40, 34)',
    '--dsw-alias-tooltip-bg': 'rgb(45, 40, 34)',
    '--dsw-specific-sidebar-fill': 'rgba(244, 239, 228, 0.8)',
    '--dsw-specific-input-major': 'rgba(253, 251, 246, 0.9)',
    '--dsw-specific-bubble': 'rgb(243, 237, 225)',
    '--dsw-specific-bubble-highlight': 'rgb(240, 224, 216)',
    '--dsw-specific-selector': 'rgb(246, 242, 233)',
    '--dsw-specific-tip': 'rgb(246, 242, 233)',
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(60, 50, 38, 0.06)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(60, 50, 38, 0.11)',
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgb(247, 236, 232)',
    '--dsw-font-family': '\'Songti SC\', \'Source Han Serif SC\', \'Noto Serif CJK SC\', Georgia, serif',
    '--dsh-shell-surface': 'transparent',
    '--dsh-shell-sidebar-surface': 'rgba(244, 239, 228, 0.8)',
    '--dsh-backdrop-base': 'linear-gradient(180deg, #FBF7EE 0%, #F5EFE2 100%)',
    '--dsh-backdrop-veil': 'rgba(251, 247, 238, 0.55)',
    '--dsh-backdrop-ink': 'rgba(46, 42, 38, 0.16)',
    '--dsh-backdrop-accent': 'rgba(158, 61, 50, 0.5)',
  },
}

/**
 * Sakura: a Shinkai sky — saturated blue overhead, warm haze at the horizon,
 * petals falling across it. Text is deep indigo rather than black so it sits
 * inside the sky's own hue family.
 */
const SAKURA: ThemeDefinition = {
  id: 'sakura',
  colorScheme: 'light',
  tokens: {
    '--dsw-alias-bg-base': 'transparent',
    '--dsw-alias-bg-layer-1': 'rgba(255, 255, 255, 0.9)',
    '--dsw-alias-bg-layer-2': 'rgb(255, 253, 254)',
    '--dsw-alias-bg-layer-3': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-overlay': 'rgb(255, 255, 255)',
    '--dsw-alias-bg-module-platform': 'rgba(255, 255, 255, 0.7)',
    '--dsw-alias-label-primary': 'rgb(40, 44, 74)',
    '--dsw-alias-label-secondary': 'rgb(96, 102, 138)',
    '--dsw-alias-label-tertiary': 'rgb(132, 138, 170)',
    '--dsw-alias-label-caption': 'rgb(156, 162, 190)',
    '--dsw-alias-accent-primary': 'rgb(233, 108, 148)',
    '--dsw-alias-accent-soft': 'rgb(255, 240, 245)',
    '--dsw-alias-ring': 'rgba(233, 108, 148, 0.36)',
    '--dsw-alias-border-l1': 'rgba(64, 76, 128, 0.08)',
    '--dsw-alias-border-l2': 'rgba(64, 76, 128, 0.14)',
    '--dsw-alias-border-l3': 'rgba(64, 76, 128, 0.18)',
    '--dsw-alias-border-l4': 'rgba(64, 76, 128, 0.24)',
    '--dsw-alias-brand-primary': 'rgb(40, 44, 74)',
    '--dsw-alias-interactive-bg-hover': 'rgba(64, 76, 128, 0.06)',
    '--dsw-alias-interactive-bg-active': 'rgba(64, 76, 128, 0.1)',
    '--dsw-alias-interactive-bg-hover-accent': 'rgba(233, 108, 148, 0.14)',
    '--dsw-alias-interactive-bg-hover-solid': 'rgb(244, 247, 255)',
    '--dsw-alias-markdown-code-block': 'rgb(246, 248, 255)',
    '--dsw-alias-markdown-code-block-banner': 'rgb(238, 242, 254)',
    '--dsw-alias-markdown-inline-code': 'rgb(240, 244, 255)',
    '--dsw-alias-markdown-citation': 'rgb(240, 244, 255)',
    '--dsw-alias-markdown-tag': 'rgb(240, 244, 255)',
    '--dsw-alias-markdown-placeholder': 'rgb(246, 248, 255)',
    '--dsw-alias-scrollbar-bg-l1': 'rgba(64, 76, 128, 0.2)',
    '--dsw-alias-scrollbar-bg-l2': 'rgba(64, 76, 128, 0.2)',
    '--dsw-alias-scrollbar-hover-l1': 'rgba(64, 76, 128, 0.32)',
    '--dsw-alias-scrollbar-hover-l2': 'rgba(64, 76, 128, 0.32)',
    '--dsw-alias-toast-bg': 'rgb(48, 54, 90)',
    '--dsw-alias-tooltip-bg': 'rgb(48, 54, 90)',
    '--dsw-specific-sidebar-fill': 'rgba(240, 245, 255, 0.72)',
    '--dsw-specific-input-major': 'rgba(255, 255, 255, 0.88)',
    '--dsw-specific-bubble': 'rgb(255, 238, 244)',
    '--dsw-specific-bubble-highlight': 'rgb(255, 214, 229)',
    '--dsw-specific-selector': 'rgb(244, 247, 255)',
    '--dsw-specific-tip': 'rgb(244, 247, 255)',
    '--dsw-specific-sidebar-nav-item-hover': 'rgba(64, 76, 128, 0.07)',
    '--dsw-specific-sidebar-nav-item-active': 'rgba(64, 76, 128, 0.12)',
    '--dsw-specific-sidebar-nav-item-active-accent': 'rgb(255, 240, 245)',
    '--dsh-shell-surface': 'transparent',
    '--dsh-shell-sidebar-surface': 'rgba(240, 245, 255, 0.72)',
    '--dsh-backdrop-base': 'linear-gradient(180deg, #7FB4E8 0%, #BBD9F2 42%, #F6DCE0 78%, #FBEFE4 100%)',
    '--dsh-backdrop-veil': 'rgba(255, 255, 255, 0.5)',
    '--dsh-backdrop-ink': 'rgba(255, 255, 255, 0.85)',
    '--dsh-backdrop-accent': 'rgba(233, 108, 148, 0.75)',
  },
}

/**
 * Abyss: the professional default. It overrides NO color token — the base dark
 * palette is the theme — and contributes only the deep-sea backdrop, which the
 * still-opaque canvas leaves showing at the edges.
 */
const ABYSS: ThemeDefinition = {
  id: 'abyss',
  colorScheme: 'dark',
  tokens: {
    '--dsh-backdrop-base': 'radial-gradient(ellipse 120% 90% at 50% -10%, #1D2434 0%, #141720 60%, #101319 100%)',
    '--dsh-backdrop-veil': 'transparent',
    '--dsh-backdrop-ink': 'rgba(122, 158, 255, 0.05)',
    '--dsh-backdrop-accent': 'rgba(122, 158, 255, 0.09)',
  },
}

/** The pack's themes in gallery order (registration order is what the registry publishes). */
export const STUDIO_THEMES: readonly ThemeDefinition[] = [STARLIGHT, PORCELAIN, INK, SAKURA, ABYSS]
