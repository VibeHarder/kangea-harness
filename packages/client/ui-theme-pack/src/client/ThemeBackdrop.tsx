/**
 * The decorative layer occupying the shell's `shell.background` seat: one
 * element tree per theme, chosen by the active theme id mirrored into this
 * entry's store.
 *
 * Everything here is artwork. The seat is `aria-hidden` and pointer-transparent
 * by contract, so this tree carries no text, no focusable node, and no handler
 * — a theme the pack does not draw (the built-in light/dark, or an id from
 * another pack) renders the bare surface and the shell's own fill shows.
 */
import type { ReactElement } from 'react'
import type { PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the ui-layout SlotMap merge (the shell.background seat).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type { createBackdropStore } from './backdrop-store.ts'
import css from './ThemeBackdrop.module.css'
import starlight from './art/starlight.module.css'
import porcelain from './art/porcelain.module.css'
import ink from './art/ink.module.css'
import sakura from './art/sakura.module.css'
import abyss from './art/abyss.module.css'

/** Full component props: runtime share + the theme-id store share. */
export type ThemeBackdropProps =
  PropsRuntime<'shell.background'> & PropsStore<ReturnType<typeof createBackdropStore>>

/**
 * Star fields, mist bands, clouds, and petals repeat one class whose per-item
 * placement, duration, and delay come from `:nth-child` rules in the theme's
 * own stylesheet — structural art belongs to the art file, not to JSX.
 */
const STAR_FIELDS = [0, 1, 2]
const MIST_BANDS = [0, 1, 2]
const CLOUDS = [0, 1, 2, 3]
/** Petal count. The art contract caps the sakura layer at 14 animated elements. */
const PETALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

/** Starlight: three star fields, a tilted galaxy band, gold points among the white. */
function StarlightArt() {
  return (
    <div className={starlight.starlight}>
      <div className={starlight.band} />
      <div className={starlight.fields}>
        {STAR_FIELDS.map(index => <div key={index} className={starlight.field} />)}
      </div>
    </div>
  )
}

/** Porcelain: one huge top bloom and a near-invisible grain. Deliberately still. */
function PorcelainArt() {
  return (
    <div className={porcelain.porcelain}>
      <div className={porcelain.bloom} />
      <div className={porcelain.grain} />
    </div>
  )
}

/** Ink: bottom-anchored ridges, drifting mist, a cinnabar seal, paper grain. */
function InkArt() {
  return (
    <div className={ink.ink}>
      <div className={ink.seal} />
      <svg className={ink.mountains} viewBox="0 0 1200 400" preserveAspectRatio="none" focusable="false">
        <path
          className={ink.ridgeFar}
          d="M0,286 Q90,214 186,262 Q268,302 352,224 Q430,152 512,236 Q596,320 686,258 Q772,198 858,264 Q944,330 1040,252 Q1122,186 1200,244 L1200,400 L0,400 Z"
        />
        <path
          className={ink.ridgeMid}
          d="M0,330 Q104,286 196,318 Q286,348 372,290 Q456,234 546,296 Q636,358 728,308 Q814,262 902,314 Q990,364 1086,306 Q1150,268 1200,300 L1200,400 L0,400 Z"
        />
        <path
          className={ink.ridgeNear}
          d="M0,364 Q118,336 214,358 Q310,380 402,346 Q492,314 586,348 Q680,382 776,352 Q866,324 958,354 Q1050,384 1140,356 Q1174,346 1200,352 L1200,400 L0,400 Z"
        />
      </svg>
      <div className={ink.mist}>
        {MIST_BANDS.map(index => <div key={index} className={ink.band} />)}
      </div>
      <div className={ink.grain} />
    </div>
  )
}

/** Sakura: soft clouds over the sky gradient, with petals falling across it. */
function SakuraArt() {
  return (
    <div className={sakura.sakura}>
      <div className={sakura.clouds}>
        {CLOUDS.map(index => <div key={index} className={sakura.cloud} />)}
      </div>
      <div className={sakura.petals}>
        {PETALS.map(index => <div key={index} className={sakura.petal} />)}
      </div>
    </div>
  )
}

/** Abyss: two very faint static shafts, as if light were reaching down through water. */
function AbyssArt() {
  return (
    <div className={abyss.abyss}>
      <div className={abyss.shaft} />
      <div className={abyss.shaft} />
    </div>
  )
}

/** Artwork by theme id; an id absent here renders the bare surface. */
const ART: Record<string, () => ReactElement> = {
  starlight: StarlightArt,
  porcelain: PorcelainArt,
  ink: InkArt,
  sakura: SakuraArt,
  abyss: AbyssArt,
}

/**
 * Render the backdrop for the active theme.
 * @param props - composed slot props (the store share carries the theme id).
 * @returns the decorative layer: base wash, theme artwork, readability veil.
 */
export function ThemeBackdrop({ useStore }: ThemeBackdropProps) {
  const themeId = useStore(s => s.themeId)
  const art = ART[themeId]
  return (
    <div className={css.layer} aria-hidden="true" data-theme-backdrop={themeId}>
      {art?.()}
      {/* Last child: the veil sits over the artwork, pushing its contrast down
          until body text clears the contract's 4.5:1. A theme leaving
          --dsh-backdrop-veil unset paints nothing here. */}
      <div className={css.veil} />
    </div>
  )
}
