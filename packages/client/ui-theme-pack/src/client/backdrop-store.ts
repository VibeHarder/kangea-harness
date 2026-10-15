/**
 * Backdrop slot store: a mirror of the active theme id taken from the theme
 * service snapshot. The plugin's apply-world `theme/change` listener is the
 * only writer; the backdrop component reads it via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the theme snapshot. */
export interface BackdropState {
  /**
   * Active theme id — the RESOLVED theme, not the preference: `system` never
   * reaches the artwork, and a preference whose pack is gone renders as the
   * built-in it fell back to.
   */
  themeId: string
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type BackdropActions = {
  sync: (draft: BackdropState, themeId: string, revision: number) => void
}

/**
 * Declares the backdrop state and its write surface.
 * @returns the store handle.
 */
export function createBackdropStore(): EngineStoreHandle<BackdropState, BackdropActions> {
  return defineStore({
    init: (): BackdropState => ({ themeId: '', revision: -1 }),
    actions: {
      sync: (d, themeId: string, revision: number) => {
        if (revision <= d.revision) return
        d.themeId = themeId
        d.revision = revision
      },
    },
  })
}
