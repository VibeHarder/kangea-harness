/**
 * Host-rendered theme bootstrap for the browser's pre-plugin interval. Each
 * index response embeds the built-in preference the durable selection paints
 * as — the selection itself when it is a built-in, otherwise the registered
 * theme's persisted `colorScheme` hint, so a theme pack's dark palette does
 * not first paint light and snap. The browser resolves only `system`, then
 * writes the same DOM fields ui-layout's ThemePresenter owns after the client
 * plugin tree activates. The script's vocabulary stays the built-in triple:
 * theme ids live in the plugin world, which owns every later DOM update.
 */

import { DEFAULT_PREFERENCE, type BuiltinThemePreference } from './theme-settings.ts'

/** Build the inline script for one schema-validated built-in preference. */
function bootThemeScript(preference: BuiltinThemePreference): string {
  return `<script>(() => {
  const preference = ${JSON.stringify(preference)}
  const systemDark = preference === 'system'
    && typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-color-scheme: dark)').matches
  const dark = preference === 'dark' || systemDark
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document.body.toggleAttribute('data-ds-dark-theme', dark)
})()</script>`
}

/**
 * Insert the theme bootstrap immediately after the opening body tag, before
 * the shell mount and module script. Body-less fragments receive it at the
 * end, where the HTML parser has already synthesized a body.
 * @param html - Raw application index HTML.
 * @param preference - Built-in preference the durable selection paints as.
 * @returns HTML containing the theme bootstrap.
 */
export function injectBootTheme(
  html: string,
  preference: BuiltinThemePreference = DEFAULT_PREFERENCE,
): string {
  const script = bootThemeScript(preference)
  const body = /<body(?:\s[^>]*)?>/i.exec(html)
  if (body === null) return `${html}${script}`
  const at = body.index + body[0].length
  return `${html.slice(0, at)}${script}${html.slice(at)}`
}
