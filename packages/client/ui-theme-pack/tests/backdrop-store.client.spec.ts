/** Backdrop store: the theme-id mirror action and its revision guard. */
import { describe, expect, it } from 'vitest'
import { createBackdropStore } from '../src/client/backdrop-store.ts'

describe('createBackdropStore', () => {
  it('init shape: no theme yet, revision at -1 so revision 0 lands as a change', () => {
    expect(createBackdropStore().create().getSnapshot()).toEqual({ themeId: '', revision: -1 })
  })

  it('sync mirrors the resolved theme id and advances the revision', () => {
    const store = createBackdropStore().create()
    store.actions.sync('starlight', 0)
    expect(store.getSnapshot()).toEqual({ themeId: 'starlight', revision: 0 })
    store.actions.sync('ink', 4)
    expect(store.getSnapshot()).toEqual({ themeId: 'ink', revision: 4 })
  })

  it('revision guard drops stale and duplicate writes', () => {
    const store = createBackdropStore().create()
    store.actions.sync('sakura', 3)
    store.actions.sync('abyss', 2)
    store.actions.sync('abyss', 3)
    expect(store.getSnapshot()).toEqual({ themeId: 'sakura', revision: 3 })
  })
})
