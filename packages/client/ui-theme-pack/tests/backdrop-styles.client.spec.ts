/**
 * The artwork's mechanical contract, asserted on the stylesheets themselves —
 * the parts a jsdom render cannot see. Backdrop art spans the whole window and
 * runs while tokens stream, so what it may animate, what it may reference, and
 * what it does under reduced motion are pinned here rather than left to review.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ART_FILES = ['starlight', 'porcelain', 'ink', 'sakura', 'abyss'] as const

/** The four tokens the backdrop contract lets a theme drive the artwork with. */
const BACKDROP_TOKENS = [
  '--dsh-backdrop-base', '--dsh-backdrop-veil', '--dsh-backdrop-ink', '--dsh-backdrop-accent',
]

/** Compositor-only: the two properties an animation may touch. */
const ANIMATABLE = ['transform', 'opacity']

function read(relative: string): string {
  const source = readFileSync(fileURLToPath(new URL(`../src/client/${relative}`, import.meta.url)), 'utf8')
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ')
}

const LAYER = read('ThemeBackdrop.module.css')
const ART = new Map<string, string>(ART_FILES.map(name => [name, read(`art/${name}.module.css`)] as const))

/** One at-rule block with its prelude, located by brace matching. */
interface Block {
  prelude: string
  body: string
  start: number
  end: number
}

function blocks(css: string, atRule: string): Block[] {
  const found: Block[] = []
  const pattern = new RegExp(`@${atRule}([^{]*)\\{`, 'g')
  for (let match = pattern.exec(css); match !== null; match = pattern.exec(css)) {
    let depth = 1
    let index = match.index + match[0].length
    const bodyStart = index
    while (index < css.length && depth > 0) {
      if (css[index] === '{') depth += 1
      else if (css[index] === '}') depth -= 1
      index += 1
    }
    found.push({ prelude: match[1]!.trim(), body: css.slice(bodyStart, index - 1), start: match.index, end: index })
  }
  return found
}

/** The stylesheet with every @media block cut out. */
function outsideMedia(css: string): string {
  let remaining = css
  for (const block of blocks(css, 'media').reverse()) {
    remaining = remaining.slice(0, block.start) + remaining.slice(block.end)
  }
  return remaining
}

/** Declarations of one exact selector, keyed by property. */
function declarations(css: string, selector: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const [, selectorList = '', body = ''] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectorList.split(',').map(value => value.trim()).includes(selector)) continue
    for (const part of body.split(';')) {
      const colon = part.indexOf(':')
      if (colon === -1) continue
      found.set(part.slice(0, colon).trim(), part.slice(colon + 1).trim().replace(/\s+/g, ' '))
    }
  }
  return found
}

describe('backdrop layer stylesheet', () => {
  it('fills the shell seat, takes no pointers, and fences its paint', () => {
    const layer = declarations(LAYER, '.layer')
    expect(layer.get('position')).toBe('absolute')
    expect(layer.get('inset')).toBe('0')
    expect(layer.get('pointer-events')).toBe('none')
    // Layout, paint, and size containment: artwork repainting must not reach
    // the columns' geometry while output streams into them.
    expect(layer.get('contain')).toBe('strict')
    expect(layer.get('background')).toBe('var(--dsh-backdrop-base, none)')
    expect(declarations(LAYER, '.veil').get('background')).toBe('var(--dsh-backdrop-veil, none)')
  })
})

describe('artwork stylesheets', () => {
  it('carry no literal colors — every color arrives as a backdrop token', () => {
    for (const [name, css] of [...ART, ['ThemeBackdrop', LAYER] as const]) {
      // The data-URI grain tiles carry no color of their own (turbulence is
      // the paint), so this holds for them too.
      expect(css, name).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
      expect(css, name).not.toMatch(/\brgba?\(/)
      expect(css, name).not.toMatch(/\bhsla?\(/)
    }
  })

  it('reference only the four contract tokens (plus the shared motion curve)', () => {
    for (const [name, css] of ART) {
      for (const [, token] of css.matchAll(/var\((--[a-z0-9-]+)/g)) {
        const allowed = BACKDROP_TOKENS.includes(token!) || token!.startsWith('--ds-ease-')
        expect(allowed, `${name} references ${token}`).toBe(true)
      }
    }
  })

  it('animate transform and opacity only', () => {
    for (const [name, css] of ART) {
      for (const frames of blocks(css, 'keyframes')) {
        for (const [, property] of frames.body.matchAll(/([a-z-]+)\s*:/g)) {
          expect(ANIMATABLE, `${name} @keyframes${frames.prelude} animates ${property}`).toContain(property)
        }
      }
      // Nothing large-area and expensive: no blur, no shadow, no scrolling
      // gradient — apps/web's perf specs measure exactly these.
      expect(css, name).not.toMatch(/\bfilter\s*:/)
      expect(css, name).not.toMatch(/\bbackdrop-filter\s*:/)
      expect(css, name).not.toMatch(/\bbox-shadow\s*:/)
      expect(css, name).not.toMatch(/\bbackground-position\s*:/)
      expect(css, name).not.toMatch(/\btransition\s*:/)
    }
  })

  it('start every animation behind prefers-reduced-motion and answer it with a still frame', () => {
    for (const [name, css] of ART) {
      // No animation may be declared unconditionally.
      expect(outsideMedia(css), name).not.toMatch(/\banimation(-name|-duration|-delay)?\s*:/)
      const motion = blocks(css, 'media')
      const moving = motion.filter(block => block.prelude.includes('no-preference'))
      const still = motion.filter(block => block.prelude.includes('reduce'))
      if (moving.length === 0) {
        // Porcelain and Abyss are deliberately static: no motion, so no
        // reduced-motion branch to write.
        expect(still, `${name} has a reduce branch but nothing to reduce`).toHaveLength(0)
        continue
      }
      expect(still.length, `${name} animates without a reduced-motion answer`).toBeGreaterThan(0)
      expect(still.map(block => block.body).join('\n'), name).toMatch(/animation:\s*none/)
    }
  })

  it('keep the ink mist slower than the contract floor of 40s', () => {
    const drift = [...ART.get('ink')!.matchAll(/animation:\s*ink-drift\s+(\d+)s/g)]
    expect(drift.length).toBeGreaterThan(0)
    for (const [, seconds] of drift) expect(Number(seconds)).toBeGreaterThanOrEqual(40)
  })
})
