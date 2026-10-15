// @vitest-environment jsdom
/**
 * ThemeBackdrop: the layer draws the artwork of whichever theme the store
 * mirrors, and degrades to the bare surface for any theme the pack does not
 * draw (the built-in light/dark, an id from another pack, or the pre-sync
 * empty state). The tree stays decorative throughout — no text, no focusable
 * node.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { createSnapshotStore, type SessionListState, type WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { ThemeBackdrop, type ThemeBackdropProps } from '../src/client/ThemeBackdrop.tsx'
import { createBackdropStore } from '../src/client/backdrop-store.ts'
import starlight from '../src/client/art/starlight.module.css'
import porcelain from '../src/client/art/porcelain.module.css'
import ink from '../src/client/art/ink.module.css'
import sakura from '../src/client/art/sakura.module.css'
import abyss from '../src/client/art/abyss.module.css'

afterEach(cleanup)

/**
 * Read one class out of an artwork stylesheet, failing loud when the local
 * name is gone — a renamed class would otherwise turn every assertion below
 * into a vacuous `.undefined` query.
 * @param sheet - the imported CSS Module map.
 * @param local - the local class name.
 * @returns the emitted class name.
 */
function artClass(sheet: Record<string, string | undefined>, local: string): string {
  const value = sheet[local]
  if (value === undefined) throw new Error(`class .${local} missing from its artwork stylesheet`)
  return value
}

/** Root art class per theme id — the one class each artwork file owns. */
const ART_ROOT = {
  starlight: artClass(starlight, 'starlight'),
  porcelain: artClass(porcelain, 'porcelain'),
  ink: artClass(ink, 'ink'),
  sakura: artClass(sakura, 'sakura'),
  abyss: artClass(abyss, 'abyss'),
}

/** Empty global standard-kit hooks (the decorative layer reads neither). */
function emptySessions() {
  const store = createSnapshotStore<SessionListState>({
    ids: [], byId: {}, current: undefined, phase: 'ready',
    subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined,
  })
  return bindSnapshotSelector(store)
}

function emptyWorkspaces() {
  const store = createSnapshotStore<WorkspaceListState>({
    items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined,
  })
  return bindSnapshotSelector(store)
}

function mount(themeId?: string) {
  // Real store instance — the sanctioned zero-machinery path for tests.
  const store = createBackdropStore().create()
  if (themeId !== undefined) store.actions.sync(themeId, 0)
  const props: ThemeBackdropProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
  }
  const view = render(<ThemeBackdrop {...props} />)
  return { store, view }
}

/** The layer element the seat renders (always exactly one). */
const layerOf = (container: HTMLElement): HTMLElement => container.firstElementChild as HTMLElement

describe('ThemeBackdrop', () => {
  it('draws each pack theme its own artwork', () => {
    for (const [id, className] of Object.entries(ART_ROOT)) {
      const { view } = mount(id)
      const layer = layerOf(view.container)
      expect(layer.getAttribute('data-theme-backdrop'), id).toBe(id)
      expect(layer.querySelector(`.${className}`), id).not.toBeNull()
      // One artwork at a time: no other theme's root leaks into the tree.
      for (const other of Object.values(ART_ROOT).filter(value => value !== className)) {
        expect(layer.querySelector(`.${other}`), `${id} vs ${other}`).toBeNull()
      }
      cleanup()
    }
  })

  it('degrades to the bare surface for a theme it does not draw', () => {
    // Built-in, foreign pack id, and the pre-sync empty state all take the
    // same arm: the layer renders, the artwork does not.
    for (const id of ['light', 'dark', 'someone-elses-theme', undefined]) {
      const { view } = mount(id)
      const layer = layerOf(view.container)
      expect(layer.getAttribute('data-theme-backdrop'), String(id)).toBe(id ?? '')
      for (const className of Object.values(ART_ROOT)) {
        expect(layer.querySelector(`.${className}`), String(id)).toBeNull()
      }
      // The veil is unconditional: it is a token, present in every theme.
      expect(layer.childElementCount, String(id)).toBe(1)
      cleanup()
    }
  })

  it('follows the store when the active theme changes', () => {
    const b = mount('porcelain')
    expect(layerOf(b.view.container).querySelector(`.${ART_ROOT.porcelain}`)).not.toBeNull()
    act(() => { b.store.actions.sync('ink', 1) })
    expect(layerOf(b.view.container).querySelector(`.${ART_ROOT.porcelain}`)).toBeNull()
    expect(layerOf(b.view.container).querySelector(`.${ART_ROOT.ink}`)).not.toBeNull()
  })

  it('stays decorative: hidden from assistive tech, no text, nothing focusable', () => {
    const { view } = mount('sakura')
    const layer = layerOf(view.container)
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.textContent).toBe('')
    expect(layer.querySelectorAll('a, button, input, [tabindex]')).toHaveLength(0)
  })

  it('caps the sakura petal count at the art contract\'s fourteen', () => {
    const { view } = mount('sakura')
    const petals = layerOf(view.container).querySelectorAll(`.${artClass(sakura, 'petal')}`)
    expect(petals.length).toBeGreaterThanOrEqual(10)
    expect(petals.length).toBeLessThanOrEqual(14)
  })
})
