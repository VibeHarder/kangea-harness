/**
 * Studio theme pack, browser half: registers the five palettes with the theme
 * registry and occupies the shell's decorative `shell.background` seat with
 * the matching artwork.
 *
 * The two halves meet in the token map. A theme hands the backdrop its
 * `--dsh-backdrop-*` values (base wash, veil, ink, accent) and the shell
 * surface tokens that let the art show at all; the artwork consumes those
 * variables and supplies only structure — where the stars sit, how the ridges
 * fall. Nothing else crosses: the component never sees ctx, and the theme id
 * it draws from reaches it through this entry's store.
 *
 * Registration is the durability gate for a theme id, so both are effects: the
 * palettes leave the registry and the seat empties when this plugin unloads,
 * while the user's durable selection survives to be honored on reload.
 */
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ui-layout SlotMap merge (the shell.background seat).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: pulls the ui-theme Context merge (ctx.theme) and its snapshot type.
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import { ThemeBackdrop } from './ThemeBackdrop.tsx'
import { createBackdropStore } from './backdrop-store.ts'
import { STUDIO_THEMES } from './themes.ts'

/** List-entry id of the pack's backdrop in the shell background list seat. */
const BACKDROP_ENTRY_ID = 'theme-pack-backdrop'

/** Required services: the theme registry and the shell's slot registry. */
export const inject = ['slots', 'theme']

/**
 * Client plugin body: register the palettes, then the backdrop entry that
 * draws whichever of them is active.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const disposers = STUDIO_THEMES.map(theme => ctx.theme.register(theme))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'ui-theme-pack: palettes')

  const store = createBackdropStore()
  let bound: BoundActions<typeof store> | undefined
  const sync = (snapshot: ThemeSnapshot): void => {
    bound?.sync(snapshot.active.id, snapshot.revision)
  }
  ctx.on('theme/change', sync)

  ctx.slots.inject('shell.background', () => ctx.slots.register({
    name: 'shell.background',
    id: BACKDROP_ENTRY_ID,
    order: 0,
    store,
    // The seat is decorative, so this face carries no business callbacks: its
    // whole job is to hand the apply world the store's writer, exactly once,
    // and to re-read the service so no change is lost between registration
    // and first render (the store's revision guard drops stale duplicates).
    inject: (actions: BoundActions<typeof store>) => {
      bound = actions
      sync(ctx.theme.getTheme())
      return {}
    },
  }, ThemeBackdrop))
}
