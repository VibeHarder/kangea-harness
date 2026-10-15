/**
 * ui-theme-pack browser half on a real SlotRegistry and a real ThemeRuntime:
 * the plugin adds its five palettes to the theme registry beside the built-in
 * pair, occupies the shell-declared `shell.background` list seat with the
 * backdrop, mirrors the RESOLVED theme id into that entry's store, and gives
 * both contributions back on teardown (HMR safety) without disturbing the
 * user's durable selection.
 */
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { stubSettingsScope } from '@deepseek-ai/dsh-client-test-runtime'
import { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
import type { ThemeSettings } from '@deepseek-ai/dsh-client-ui-theme/client'
import { ThemeBackdrop } from '../src/client/ThemeBackdrop.tsx'
import type { createBackdropStore } from '../src/client/backdrop-store.ts'
import { STUDIO_THEMES } from '../src/client/themes.ts'
import { apply, inject } from '../src/client/index.ts'
import { apply as nodeApply } from '../src/index.ts'

const SLOT = 'shell.background'
const PACK_IDS = ['starlight', 'porcelain', 'ink', 'sakura', 'abyss']

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const slots = ctx.get('slots') as SlotRegistry
  const theme = new ThemeRuntime(ctx, stubSettingsScope<ThemeSettings>().scope)
  ctx.provide('theme', theme)
  return { ctx, slots, theme }
}

/** Stand in for the shell: declare the decorative seat from root. */
function declareBackground(slots: SlotRegistry): () => void {
  return slots.register(
    { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
    () => null,
  )
}

/**
 * Mirror the framework's inject choreography: bake a real instance from the
 * declared handle and hand its actions to the entry's inject factory.
 */
function faceOf(slots: SlotRegistry) {
  const entry = slots.entries(SLOT).find(e => e.component === ThemeBackdrop)!
  const handle = entry.store as ReturnType<typeof createBackdropStore>
  const instance = handle.create()
  const face = (entry.inject as unknown as (a: typeof instance.actions) => object)(instance.actions)
  return { entry, instance, face }
}

describe('ui-theme-pack browser apply', () => {
  it('declares every service it binds', () => {
    expect(inject).toEqual(['slots', 'theme'])
  })

  it('node-half apply is an intentional no-op', () => {
    expect(() => { nodeApply() }).not.toThrow()
  })

  it('registers all five palettes beside the built-in pair', async () => {
    const b = await bench()
    expect(b.theme.getTheme().themes.map(t => t.id)).toEqual(['light', 'dark'])

    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()

    const registered = b.theme.getTheme().themes
    expect(registered.map(t => t.id)).toEqual(['light', 'dark', ...PACK_IDS])
    // Every palette drives the backdrop through the four contract tokens plus
    // the shell-surface indirection its artwork needs to be visible at all.
    for (const definition of STUDIO_THEMES) {
      expect(Object.keys(definition.tokens)).toEqual(
        expect.arrayContaining([
          '--dsh-backdrop-base', '--dsh-backdrop-veil', '--dsh-backdrop-ink', '--dsh-backdrop-accent',
        ]),
      )
    }
    // Abyss is the default professional preset: backdrop only, no color token.
    const abyss = registered.find(t => t.id === 'abyss')!
    expect(Object.keys(abyss.tokens).every(name => name.startsWith('--dsh-backdrop-'))).toBe(true)
    expect(registered.filter(t => t.colorScheme === 'dark').map(t => t.id))
      .toEqual(['dark', 'starlight', 'abyss'])

    // Teardown returns the registry to the bare pair; the durable preference
    // is the service's business, not the pack's.
    await fiber.dispose()
    expect(b.theme.getTheme().themes.map(t => t.id)).toEqual(['light', 'dark'])
  })

  it('waits until the shell declares the background seat', async () => {
    const b = await bench()
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(b.slots.entries(SLOT)).toHaveLength(0)

    declareBackground(b.slots)
    await Promise.resolve()
    const entry = b.slots.entries(SLOT)[0]!
    expect(entry.component).toBe(ThemeBackdrop)
    // A list seat: the pack takes one named cell and leaves the rest of the
    // layer free for another contribution.
    expect(entry.options).toMatchObject({ id: 'theme-pack-backdrop', order: 0 })

    await fiber.dispose()
    expect(b.slots.entries(SLOT)).toHaveLength(0)
  })

  it('mirrors the resolved theme id into the entry store, before and after inject', async () => {
    const b = await bench()
    declareBackground(b.slots)
    await b.ctx.plugin({ inject: [...inject], apply }).await()

    // A change ahead of any inject hits the unbound-actions arm: the entry
    // exists on the ledger, but no store instance has been baked yet.
    b.theme.setTheme('sakura')

    const { instance } = faceOf(b.slots)
    // The inject-time re-read seals that window: the mirror is current.
    expect(instance.getSnapshot().themeId).toBe('sakura')

    b.theme.setTheme('ink')
    expect(instance.getSnapshot().themeId).toBe('ink')

    // The RESOLVED theme is what the artwork keys off: `system` resolves to a
    // built-in, and the backdrop draws that instead of the preference word.
    b.theme.setTheme('system')
    expect(instance.getSnapshot()).toMatchObject({ themeId: 'light' })
  })

  it('recovers after an HMR collapse of the declaring entry', async () => {
    const b = await bench()
    const shell = declareBackground(b.slots)
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    expect(b.slots.entries(SLOT)).toHaveLength(1)

    // Collapse: the declarer dies and the cascade removes our entry while the
    // apply closure still holds its (now stale) disposer.
    shell()
    expect(b.slots.entries(SLOT)).toHaveLength(0)

    declareBackground(b.slots)
    await Promise.resolve()
    expect(b.slots.entries(SLOT).some(e => e.component === ThemeBackdrop)).toBe(true)
  })
})
