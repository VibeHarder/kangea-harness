/** The package's invariant companion: it reserves the package name with the
 * documented empty installer (the pack's relations are browser-side and are
 * asserted by this package's registration specs). */
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import InvariantRegistry from '@deepseek-ai/dsh-invariants'
import * as ThemePackInvariant from '../src/invariant.ts'

describe('invariant companion', () => {
  it('registers under the package name with an empty installer', async () => {
    const ctx = new Context()
    await ctx.plugin(InvariantRegistry, { enabled: true })
    await expect(ctx.plugin(ThemePackInvariant).await()).resolves.toBeDefined()
  })
})
