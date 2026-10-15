/** Host registration for the browser theme preference and pre-plugin palette. */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { injectBootTheme } from './boot-theme.ts'
import {
  DEFAULT_PREFERENCE, isThemePreference, THEME_SETTINGS_NAMESPACE, ThemeSettingsSchema,
  type BuiltinThemePreference, type ThemeSettings,
} from './theme-settings.ts'

export {
  DEFAULT_PREFERENCE, THEME_COLOR_SCHEME_FIELD, THEME_PREFERENCE_FIELD, THEME_PREFERENCES,
  THEME_SETTINGS_NAMESPACE,
  type BuiltinThemePreference, type ThemePreference, type ThemeSettings,
} from './theme-settings.ts'

const THEME_NAMESPACE = settingsNamespace(THEME_SETTINGS_NAMESPACE)

/**
 * Resolve what the boot script should paint: the durable preference when it is
 * a built-in (documents predating the hint keep booting exactly as before),
 * otherwise the `colorScheme` hint the registered theme persisted alongside
 * its id. Without a settings provider the schema default answers.
 */
function readBootPreference(ctx: Context): BuiltinThemePreference {
  const settings = ctx.get('settings')
  if (settings === undefined) return DEFAULT_PREFERENCE
  const section = settings.get(THEME_NAMESPACE) as ThemeSettings | undefined
  if (section === undefined) return DEFAULT_PREFERENCE
  return isThemePreference(section.preference) ? section.preference : section.colorScheme
}

/**
 * Register the durable theme section and initial-theme index transform when
 * their optional Host services are composed.
 * @param ctx - Host context that may acquire settings and HTTP services.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(THEME_NAMESPACE, ThemeSettingsSchema)
  })
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(
      () => httpCtx.webServer.tapIndex(html => injectBootTheme(html, readBootPreference(ctx))),
      'client-ui-theme: initial theme bootstrap',
    )
  })
}
