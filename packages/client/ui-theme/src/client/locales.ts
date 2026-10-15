/** `settings.theme` namespace dictionaries (the Appearance gallery's copy). */

/**
 * Simplified Chinese dictionary (the key-set source of truth).
 *
 * `theme.<id>` rows are the gallery's display names, keyed by theme id: the
 * two built-ins, the `system` deferral, and the shipped theme packs. A theme
 * whose id has no row here is not a bug — the gallery falls back to the raw
 * id, so a pack registered by a third party still renders and stays
 * selectable.
 */
export const zh = {
  'appearance.title': '外观',
  'theme.light': '浅色',
  'theme.dark': '深色',
  'theme.system': '跟随系统',
  'theme.starlight': '星穹 Starlight',
  'theme.porcelain': '素瓷 Porcelain',
  'theme.ink': '山水 Ink',
  'theme.sakura': '樱色 Sakura',
  'theme.abyss': '深渊 Abyss',
} satisfies Record<string, string>

/** The settings.theme namespace key union. */
export type ThemeKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'appearance.title': 'Appearance',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',
  'theme.starlight': 'Starlight',
  'theme.porcelain': 'Porcelain',
  'theme.ink': 'Ink',
  'theme.sakura': 'Sakura',
  'theme.abyss': 'Abyss',
} satisfies Record<ThemeKey, string>

/**
 * Resolve the dictionary key naming a theme id.
 * @param id - registered theme id, or the `system` preference.
 * @returns the `theme.<id>` key when this namespace names that theme,
 * otherwise undefined — the caller shows the raw id instead of translating.
 */
export function themeNameKey(id: string): ThemeKey | undefined {
  const key = `theme.${id}`
  return Object.hasOwn(zh, key) ? key as ThemeKey : undefined
}
