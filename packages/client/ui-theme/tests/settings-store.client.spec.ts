/** Appearance row store: snapshot-mirror action and the revision guard. */
import { describe, expect, it } from 'vitest'
import { createAppearanceRowStore, type AppearanceThemeOption } from '../src/client/settings-store.ts'

const BUILTINS: readonly AppearanceThemeOption[] = [
  { id: 'light', colorScheme: 'light', tokens: {} },
  { id: 'dark', colorScheme: 'dark', tokens: {} },
]

describe('createAppearanceRowStore', () => {
  it('init shape: system preference, empty registry, revision at -1', () => {
    const store = createAppearanceRowStore().create()
    expect(store.getSnapshot()).toEqual({ preference: 'system', themes: [], revision: -1 })
  })

  it('sync mirrors the preference and the registry, and advances the revision', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', BUILTINS, 0)
    expect(store.getSnapshot()).toEqual({ preference: 'dark', themes: BUILTINS, revision: 0 })
    const pack: AppearanceThemeOption = {
      id: 'starlight', colorScheme: 'dark', tokens: { '--dsw-alias-accent-primary': 'rgb(214, 190, 133)' },
    }
    store.actions.sync('starlight', [...BUILTINS, pack], 2)
    expect(store.getSnapshot().preference).toBe('starlight')
    expect(store.getSnapshot().themes.map(theme => theme.id)).toEqual(['light', 'dark', 'starlight'])
    expect(store.getSnapshot().revision).toBe(2)
  })

  it('keeps its own copy of the registry rather than the service objects', () => {
    const store = createAppearanceRowStore().create()
    const tokens = { '--dsw-alias-bg-base': 'transparent' }
    const source: AppearanceThemeOption[] = [{ id: 'ink', colorScheme: 'light', tokens }]
    store.actions.sync('ink', source, 0)
    const stored = store.getSnapshot().themes[0]!
    expect(stored).toEqual({ id: 'ink', colorScheme: 'light', tokens })
    expect(stored).not.toBe(source[0])
    expect(stored.tokens).not.toBe(tokens)
  })

  it('revision guard drops stale and duplicate writes', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', BUILTINS, 3)
    store.actions.sync('system', [], 2)
    store.actions.sync('system', [], 3)
    expect(store.getSnapshot().preference).toBe('dark')
    expect(store.getSnapshot().themes.map(theme => theme.id)).toEqual(['light', 'dark'])
    expect(store.getSnapshot().revision).toBe(3)
  })
})
