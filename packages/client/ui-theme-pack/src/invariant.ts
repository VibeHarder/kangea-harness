/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-theme-pack`.
 * @module @deepseek-ai/dsh-client-ui-theme-pack/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-theme-pack'

/** Cordis companion plugin name. */
export const name = 'client-ui-theme-pack-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the pack contributes a token map per theme and one
 * decorative slot entry, and both relations — registry membership and seat
 * occupancy with their teardown — are observable only in the browser, where
 * this package's own registration and disposal specs already assert them.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns The installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
