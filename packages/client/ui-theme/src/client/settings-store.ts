/**
 * Appearance and font row slot stores: mirrors of the theme service
 * snapshot. The plugin's apply-world change listener is the only writer; the
 * row components read via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'
import { DEFAULT_FONT_SIZES, type FontFamilies, type FontSizes, type ThemePreference } from '../theme-settings.ts'

/**
 * One gallery-selectable theme, flattened to plain JSON: the tiles draw their
 * micro-preview by painting the token map as inline custom properties, so the
 * map travels with the id rather than being fetched back from the service.
 */
export interface AppearanceThemeOption {
  /** Registered theme id (the setTheme argument). */
  id: string
  /** Base palette the theme builds on; the tile previews that scheme. */
  colorScheme: 'light' | 'dark'
  /** The theme's own token overrides, keyed by CSS custom-property name. */
  tokens: Readonly<Record<string, string>>
}

/** Store state mirrored from the theme snapshot. */
export interface AppearanceRowState {
  /** Persisted preference (selection state reads this, never the resolved active theme). */
  preference: ThemePreference
  /** Registered themes in registration order; the gallery's tile source. */
  themes: readonly AppearanceThemeOption[]
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type AppearanceRowActions = {
  sync: (
    draft: AppearanceRowState,
    preference: ThemePreference,
    themes: readonly AppearanceThemeOption[],
    revision: number,
  ) => void
}

/**
 * Declares the Appearance row state and write surface.
 * @returns the store handle.
 */
export function createAppearanceRowStore(): EngineStoreHandle<AppearanceRowState, AppearanceRowActions> {
  return defineStore({
    init: (): AppearanceRowState => ({ preference: 'system', themes: [], revision: -1 }),
    actions: {
      sync: (
        d,
        preference: ThemePreference,
        themes: readonly AppearanceThemeOption[],
        revision: number,
      ) => {
        if (revision <= d.revision) return
        d.preference = preference
        // Copy each definition: the registry's objects belong to the service
        // (and to whichever pack registered them), so the store keeps its own
        // plain data rather than pinning a foreign object graph.
        d.themes = themes.map(theme => ({
          id: theme.id,
          colorScheme: theme.colorScheme,
          tokens: { ...theme.tokens },
        }))
        d.revision = revision
      },
    },
  })
}

/** Store state mirrored from the theme snapshot's fonts (shared by the font-size row and the font settings group). */
export interface FontRowState {
  /** Persisted font sizes in px by role. */
  fontSizes: FontSizes
  /** Persisted normalized font lists by role. */
  fontFamilies: FontFamilies
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type FontRowActions = {
  sync: (draft: FontRowState, fontSizes: FontSizes, fontFamilies: FontFamilies, revision: number) => void
}

/**
 * Declares the font rows' state and write surface.
 * @returns the store handle.
 */
export function createFontRowStore(): EngineStoreHandle<FontRowState, FontRowActions> {
  return defineStore({
    init: (): FontRowState => ({ fontSizes: DEFAULT_FONT_SIZES, fontFamilies: { text: '', code: '', terminal: '' }, revision: -1 }),
    actions: {
      sync: (d, fontSizes: FontSizes, fontFamilies: FontFamilies, revision: number) => {
        if (revision <= d.revision) return
        d.fontSizes = fontSizes
        d.fontFamilies = fontFamilies
        d.revision = revision
      },
    },
  })
}
