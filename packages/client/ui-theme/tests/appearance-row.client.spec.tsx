// @vitest-environment jsdom
/** AppearanceRow gallery behavior: one tile per registered theme plus the
 * `system` deferral, selection follows the persisted preference, each tile
 * carries its own theme tokens for the micro-preview, an id the dictionary
 * does not name still renders, and clicks drive setTheme. */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createSnapshotStore, type SessionListState, type WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { makeTranslate } from '@deepseek-ai/dsh-client-test-runtime'
import { AppearanceRow } from '../src/client/AppearanceRow.tsx'
import type { AppearanceRowComponentProps } from '../src/client/AppearanceRow.tsx'
import { createAppearanceRowStore, type AppearanceThemeOption } from '../src/client/settings-store.ts'
import { zh } from '../src/client/locales.ts'
import type { ThemePreference } from '../src/client/index.ts'

afterEach(cleanup)

/** The registry as the service publishes it: the built-in pair, tokens empty. */
const BUILTINS: readonly AppearanceThemeOption[] = [
  { id: 'light', colorScheme: 'light', tokens: {} },
  { id: 'dark', colorScheme: 'dark', tokens: {} },
]

/** A theme pack: a named id carrying a real token map. */
const STARLIGHT: AppearanceThemeOption = {
  id: 'starlight',
  colorScheme: 'dark',
  tokens: {
    '--dsw-alias-accent-primary': 'rgb(214, 190, 133)',
    '--dsh-backdrop-base': 'radial-gradient(#1b2440 0%, #07090f 100%)',
  },
}

/** A pack this namespace has no name for — the gallery must not crash on it. */
const UNNAMED: AppearanceThemeOption = { id: 'moss', colorScheme: 'light', tokens: {} }

/** Empty global standard-kit hooks (the row reads neither). */
function emptySessions() {
  const store = createSnapshotStore<SessionListState>(
    { ids: [], byId: {}, current: undefined, phase: 'ready', subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined })
  return bindSnapshotSelector(store)
}
function emptyWorkspaces() {
  const store = createSnapshotStore<WorkspaceListState>({
    items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined,
  })
  return bindSnapshotSelector(store)
}

function mount(
  preference: ThemePreference = 'system',
  themes: readonly AppearanceThemeOption[] = BUILTINS,
) {
  // Real store instance — the sanctioned zero-machinery path for tests.
  const store = createAppearanceRowStore().create()
  store.actions.sync(preference, themes, 0)
  const setTheme = vi.fn()
  const props: AppearanceRowComponentProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    t: makeTranslate(zh),
    setTheme,
  }
  render(<AppearanceRow {...props} />)
  return { store, setTheme }
}

const tile = (name: string): HTMLElement => screen.getByRole('button', { name })
const pressed = (name: string): string | null => tile(name).getAttribute('aria-pressed')
/** The tile's micro-preview: the decoration the accessible name skips over. */
const preview = (name: string): HTMLElement => {
  const found = tile(name).querySelector('[aria-hidden="true"]')
  if (found === null) throw new Error(`tile "${name}" has no preview`)
  return found as HTMLElement
}

describe('AppearanceRow', () => {
  it('renders the title, one tile per registered theme, and the system tile last', () => {
    mount('dark')
    expect(screen.getByText('外观')).toBeDefined()
    expect(screen.getAllByRole('button').map(button => button.textContent))
      .toEqual(['浅色', '深色', '跟随系统'])
    expect(pressed('深色')).toBe('true')
    expect(pressed('浅色')).toBe('false')
    expect(pressed('跟随系统')).toBe('false')
  })

  it('grows with the registry and names a pack from the dictionary', () => {
    mount('starlight', [...BUILTINS, STARLIGHT])
    expect(screen.getAllByRole('button').map(button => button.textContent))
      .toEqual(['浅色', '深色', '星穹 Starlight', '跟随系统'])
    expect(pressed('星穹 Starlight')).toBe('true')
  })

  it("paints each tile's preview with that theme's own tokens", () => {
    mount('system', [...BUILTINS, STARLIGHT])
    const pack = preview('星穹 Starlight')
    expect(pack.style.getPropertyValue('--dsw-alias-accent-primary')).toBe('rgb(214, 190, 133)')
    expect(pack.style.getPropertyValue('--dsh-backdrop-base'))
      .toBe('radial-gradient(#1b2440 0%, #07090f 100%)')
    // A built-in carries no map: its preview restates the base palette in CSS.
    expect(preview('浅色').getAttribute('style')).toBeNull()
    // The preview is decoration; the tile's accessible name is its label alone.
    expect(tile('星穹 Starlight').textContent).toBe('星穹 Starlight')
  })

  it('falls back to the raw id for a theme the dictionary does not name', () => {
    mount('moss', [...BUILTINS, UNNAMED])
    expect(pressed('moss')).toBe('true')
    expect(screen.queryByRole('button', { name: 'theme.moss' })).toBeNull()
  })

  it('click drives setTheme; selection follows the store mirror, not the click echo', () => {
    const b = mount('dark')
    fireEvent.click(tile('浅色'))
    expect(b.setTheme).toHaveBeenCalledWith('light')
    // No store write yet: selection is unchanged.
    expect(pressed('深色')).toBe('true')
    act(() => { b.store.actions.sync('light', BUILTINS, 1) })
    expect(pressed('浅色')).toBe('true')
    expect(pressed('深色')).toBe('false')
  })

  it('renders the system tile alone before the first registry sync', () => {
    const store = createAppearanceRowStore().create()
    const props: AppearanceRowComponentProps = {
      useSessions: emptySessions(),
      useWorkspaces: emptyWorkspaces(),
      useStore: bindSnapshotSelector(store),
      actions: store.actions,
      t: makeTranslate(zh),
      setTheme: vi.fn(),
    }
    render(<AppearanceRow {...props} />)
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['跟随系统'])
    expect(pressed('跟随系统')).toBe('true')
  })
})
