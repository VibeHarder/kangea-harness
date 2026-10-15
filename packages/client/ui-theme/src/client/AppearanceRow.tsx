/**
 * Appearance row registered into the General section item slot: a title over
 * a theme gallery. Each tile is a live micro-preview — a miniature UI skeleton
 * painted with that theme's own token map — so the choice is made by looking,
 * not by reading names. Registered by this package; the theme feature owns its
 * own settings surface. Selection follows the persisted preference, never the
 * resolved active theme.
 */
import { useMemo } from 'react'
import clsx from 'clsx'
import { IconCheckOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { ThemePreference } from '../theme-settings.ts'
import { themeNameKey } from './locales.ts'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { AppearanceThemeOption, createAppearanceRowStore } from './settings-store.ts'
import css from './AppearanceRow.module.css'

/** Injected business face: the preference write (t rides the standard locale seat). */
export interface AppearanceRowInjected {
  /** Switch the theme preference. */
  setTheme: (id: ThemePreference) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AppearanceRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAppearanceRowStore>>
  & PropsLocale<'settings.theme'> & AppearanceRowInjected

/** One gallery tile: a registered theme, or the `system` deferral. */
interface ThemeTile {
  /** The preference this tile selects. */
  id: ThemePreference
  /**
   * Base palette the preview restates, or undefined for `system` — that tile
   * previews whatever the document currently resolves to, which is exactly
   * what following the OS means.
   */
  colorScheme: 'light' | 'dark' | undefined
  /** Token map painted onto the preview as inline custom properties. */
  tokens: Readonly<Record<string, string>>
}

/**
 * Build the tile list: the registry in registration order, then `system`.
 * `system` is a preference rather than a registrable id, so it never arrives
 * from the registry; appending it keeps the built-in pair leading the gallery
 * and groups the concrete palettes together.
 */
function buildTiles(themes: readonly AppearanceThemeOption[]): ThemeTile[] {
  return [
    ...themes.map(theme => ({ id: theme.id, colorScheme: theme.colorScheme, tokens: theme.tokens })),
    { id: 'system', colorScheme: undefined, tokens: {} },
  ]
}

/**
 * Render the Appearance row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function AppearanceRow({ t, setTheme, useStore }: AppearanceRowComponentProps) {
  const preference = useStore(s => s.preference)
  const themes = useStore(s => s.themes)
  const tiles = useMemo(() => buildTiles(themes), [themes])
  return (
    <div className={css.group}>
      <div className={css.title}>{t('appearance.title')}</div>
      <div className={css.gallery}>
        {tiles.map(({ id, colorScheme, tokens }) => {
          const selected = preference === id
          const nameKey = themeNameKey(id)
          return (
            <button
              key={id}
              type="button"
              className={clsx(css.tile, selected && css.selected)}
              aria-pressed={selected}
              onClick={() => { setTheme(id) }}
            >
              {/* Presentation only: the tile's accessible name is its label. */}
              <span
                aria-hidden="true"
                className={clsx(
                  css.preview,
                  colorScheme === 'light' && css.schemeLight,
                  colorScheme === 'dark' && css.schemeDark,
                )}
                // docs/web-styling.md permits component-local custom-property
                // values inline. These are the theme's own tokens, scoped to
                // this preview box — no theme branch is encoded here.
                style={tokens}
              >
                <span className={css.previewSidebar} />
                <span className={css.previewBody}>
                  <span className={css.previewLine} />
                  <span className={clsx(css.previewLine, css.previewLineShort)} />
                  <span className={css.previewDot} />
                </span>
              </span>
              <span className={css.tileName}>{nameKey === undefined ? id : t(nameKey)}</span>
              {selected && <IconCheckOutline14 className={css.check} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
