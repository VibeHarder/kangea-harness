/** Theme preferences stored in the Host user-settings document. */

import z from '@deepseek-ai/schemastery'

/**
 * Built-in preferences: the Appearance row's cubes, and the whole vocabulary
 * of the pre-plugin boot script (`system` defers to `prefers-color-scheme`).
 * Registered theme ids are durable too, but they reach the boot script only
 * through the {@link THEME_COLOR_SCHEME_FIELD} hint.
 */
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const

/** Settings namespace owned by the theme plugin. */
export const THEME_SETTINGS_NAMESPACE = 'ui-theme'

/** Field carrying the selected preference: a built-in or a registered theme id. */
export const THEME_PREFERENCE_FIELD = 'preference'

/** Field carrying the base palette the selected preference paints. */
export const THEME_COLOR_SCHEME_FIELD = 'colorScheme'

/** One of the built-in preferences; also the boot script's paint instruction. */
export type BuiltinThemePreference = typeof THEME_PREFERENCES[number]

/**
 * Durable theme preference: a built-in preference, or the id of any theme
 * registered with `ThemeRuntime.register()`. `(string & {})` keeps the
 * built-ins as completions while leaving the field open — a closed union would
 * drop a theme pack's id when the browser re-validates the durable section,
 * and the selection would not survive a reload.
 */
export type ThemePreference = BuiltinThemePreference | (string & {})

/** Default preference when the user-settings document has no override. */
export const DEFAULT_PREFERENCE: BuiltinThemePreference = 'system'

/** Durable theme section shared by the Host schema and the browser scope. */
export interface ThemeSettings {
  /** Selected preference: a built-in, or a registered theme id. */
  preference: ThemePreference
  /**
   * First-paint hint: the built-in preference painting the same base palette
   * as {@link ThemeSettings.preference}. A named theme resolves to its
   * `colorScheme`, a built-in selection repeats itself. The Host boot script
   * reads it so a durable theme-pack id paints its own palette in the
   * pre-plugin interval, before the pack registers the theme.
   */
  colorScheme: BuiltinThemePreference
}

/** Durable theme schema; also the wire envelope the browser scope validates against. */
export const ThemeSettingsSchema: z<ThemeSettings> = z.object({
  [THEME_PREFERENCE_FIELD]: z.string().default(DEFAULT_PREFERENCE),
  [THEME_COLOR_SCHEME_FIELD]: z.union([...THEME_PREFERENCES]).default(DEFAULT_PREFERENCE),
})

/**
 * Narrow one wire or registry value to a built-in preference.
 * @param value - value crossing the settings or registry boundary.
 * @returns whether the value is a built-in preference.
 */
export function isThemePreference(value: unknown): value is BuiltinThemePreference {
  return THEME_PREFERENCES.some(preference => preference === value)
}
